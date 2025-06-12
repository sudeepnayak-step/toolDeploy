import os
import pandas as pd
import pymysql
import logging
import shutil
import traceback
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define the project directory and folders
project_dir = os.getcwd()  # Assuming the script is run from the project directory
input_folder = os.path.join(project_dir, 'input')
pending_folder = os.path.join(project_dir, 'pending')
done_folder = os.path.join(project_dir, 'done')
exception_folder = os.path.join(project_dir, 'exception')  # Folder for exception files

# Ensure the pending, done, and exception folders exist
try:
    os.makedirs(pending_folder, exist_ok=True)
    os.makedirs(done_folder, exist_ok=True)
    os.makedirs(exception_folder, exist_ok=True)
    logger.info(f"Pending folder created at: {pending_folder}")
    logger.info(f"Done folder created at: {done_folder}")
    logger.info(f"Exception folder created at: {exception_folder}")
except Exception as e:
    logger.error(f"Failed to create folders: {str(e)}")
    logger.error(traceback.format_exc())
    raise

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'db': 'db_steptool',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    logger.info("Attempting to establish a database connection.")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        logger.info("Database connection established successfully.")
        return conn
    except Exception as e:
        logger.error(f"Failed to establish a database connection: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def validate_row(row, accountId, conn):
    validation_errors = []

    # Validate Activity
    activity = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ""
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT s_a_id FROM s_activitymaster WHERE s_a_code = %s AND accountId = %s", (activity, accountId))
            activity_data = cursor.fetchone()
            if activity_data is None:
                validation_errors.append("Activity data not found.")
    except Exception as e:
        validation_errors.append(f"Error validating activity: {str(e)}")

    # Add more validations as needed

    return validation_errors

def process_file(file_path, projectId, releaseId, enteredby, accountId):
    logger.info(f"Starting to process file: {file_path}")
    conn = None
    try:
        logger.info("Reading Excel file.")
        df = pd.read_excel(file_path)
        logger.info(f"Excel file {file_path} read successfully.")

        conn = get_db_connection()

        # Validate all rows before processing
        validation_errors = []
        for index, row in df.iterrows():
            newFlag = str(row.iloc[1]) if pd.notna(row.iloc[1]) else "0"
            if newFlag != "0":
                errors = []
                activity = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ""
                try:
                    with conn.cursor() as cursor:
                        cursor.execute("SELECT s_a_id FROM s_activitymaster WHERE s_a_code = %s AND accountId = %s", (activity, accountId))
                        activity_data = cursor.fetchone()
                        if activity_data is None:
                            errors.append("Activity data not found.")
                except Exception as e:
                    errors.append(f"Error validating activity: {str(e)}")

                if errors:
                    validation_errors.append((index + 1, errors))  # Store row number and errors

        if validation_errors:
            for row_num, errors in validation_errors:
                error_message = f"Validation errors in row {row_num}: {', '.join(errors)}"
                logger.error(error_message)
                # Insert notification for validation errors
                insert_notification(conn, accountId, enteredby, row_num, error_message)
            raise ValueError("Validation failed for one or more rows. No data will be inserted.")

        # If validation passes, proceed with database insertion
        stepno = 0
        with conn.cursor() as cursor:
            for index, row in df.iterrows():
                try:    
                    scenarioId = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
                    newFlag = str(row.iloc[1]) if pd.notna(row.iloc[1]) else "0"
                    activity = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ""
                    module = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ""
                    submodule = str(row.iloc[4]) if pd.notna(row.iloc[4]) else ""
                    testscenariodesc = str(row.iloc[5]) if pd.notna(row.iloc[5]) else ""
                    testcasedesc = str(row.iloc[6]) if pd.notna(row.iloc[6]) else ""
                    steps = str(row.iloc[7]) if pd.notna(row.iloc[7]) else ""
                    expectedresult = str(row.iloc[8]) if pd.notna(row.iloc[8]) else ""
                    precondition = str(row.iloc[9]) if pd.notna(row.iloc[9]) else ""
                    testdata = str(row.iloc[10]) if pd.notna(row.iloc[10]) else ""
                    testmode = str(row.iloc[11]) if pd.notna(row.iloc[11]) else ""

 
                    if newFlag == "" or newFlag == "0":
                        stepno = stepno + 1
                        stepsql = """
                        INSERT INTO s_testcase_steps (
                            s_tss_num, testcaseId, s_tss_steps, s_tss_expectedresult, accountId, s_tss_enteredby
                        ) VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        stepparams = (stepno, testcaseId, steps, expectedresult, accountId, enteredby)
                        cursor.execute(stepsql, stepparams)
                        conn.commit()
                    else:
                        if  newFlag != "1.0":
                            error_message = f"newFlag is not set to '1' in row {index + 1}."
                            logger.error(error_message)
                            # Insert notification for newFlag error
                            insert_notification(conn, accountId, enteredby, index + 1, error_message)
                            raise ValueError(error_message)

                        try:
                            stepno = 1
                            cursor.execute("SELECT s_p_code FROM s_project WHERE s_p_id = %s AND accountId = %s ORDER BY s_p_id DESC LIMIT 1", (projectId, accountId))
                            proj_data = cursor.fetchone()
                            if proj_data is None:
                                raise ValueError("Project data not found.")
                            projcode = proj_data['s_p_code']
                        except Exception as e:
                            logger.error(f"Error fetching project code: {str(e)}")
                            logger.error(traceback.format_exc())
                            raise

                        try:
                            cursor.execute("SELECT s_d_tempscenarioId FROM s_testcase WHERE projectId = %s AND accountId = %s ORDER BY s_d_tempscenarioId DESC LIMIT 1", (projectId, accountId))
                            scenario_data = cursor.fetchone()
                            scenarioId = int(scenario_data['s_d_tempscenarioId']) + 1 if scenario_data else 1
                        except Exception as e:
                            logger.error(f"Error fetching scenario ID: {str(e)}")
                            logger.error(traceback.format_exc())
                            raise

                        scenarioIdstr = f"TS-{scenarioId}"

                        try:
                            logger.info("activity: " + activity + " accountId: " + str(accountId))
                            cursor.execute("SELECT s_a_id FROM s_activitymaster WHERE s_a_code = %s AND accountId = %s", (activity, accountId))
                            activity_data = cursor.fetchone()
                            if activity_data is None:
                                error_message = f"Activity data not found in row {index + 1}."
                                logger.error(error_message)
                                # Insert notification for activity not found error
                                insert_notification(conn, accountId, enteredby, index + 1, error_message)
                                raise ValueError(error_message)
                            activityId = activity_data['s_a_id']
                        except Exception as e:
                            logger.error(f"Error fetching activity ID: {str(e)}")
                            logger.error(traceback.format_exc())
                            raise

                        try:
                            cursor.execute("SELECT s_t_tempid FROM s_testcase WHERE projectId = %s AND accountId = %s ORDER BY s_t_tempid DESC LIMIT 1", (projectId, accountId))
                            testcase_data = cursor.fetchone()
                            testcaseNum = int(testcase_data['s_t_tempid']) + 1 if testcase_data else 1
                        except Exception as e:
                            logger.error(f"Error fetching test case number: {str(e)}")
                            logger.error(traceback.format_exc())
                            raise

                        testcaseIdstr = f"{projcode}-TC-{testcaseNum}"

                        if activityId != 0:
                            try:
                                sql = """
                                INSERT INTO s_testcase (
                                    projectId, releaseId, s_t_activityIds, s_d_tempscenarioId, s_t_testscenarionum,
                                    s_t_tempid, s_t_testcasenum, s_t_module, s_t_submodule, s_t_testscenariodesc,
                                    s_t_testcasedesc, s_t_steps, s_t_expectedresult, s_t_precondition, s_t_testdata,
                                    s_t_enteredby, accountId, s_t_testmode, s_t_author
                                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """
                                params = (
                                    str(projectId), str(releaseId), str(activityId), str(scenarioId), scenarioIdstr,
                                    str(testcaseNum), testcaseIdstr, str(module), str(submodule), str(testscenariodesc),
                                    str(testcasedesc), str(steps), str(expectedresult), str(precondition), str(testdata),
                                    str(enteredby), str(accountId), str(testmode), str(enteredby)
                                )
                                cursor.execute(sql, params)
                                testcaseId = cursor.lastrowid
                                conn.commit()
                                logger.info("testcaseId: " + str(testcaseId))
                            except Exception as e:
                                logger.error(f"Error inserting into s_testcase: {str(e)}")
                                logger.error(traceback.format_exc())
                                conn.rollback()
                                raise
                        else:
                            raise ValueError("activityId is 0, which is not allowed.")

                        try:
                            stepsql = """
                            INSERT INTO s_testcase_steps (
                                s_tss_num, testcaseId, s_tss_steps, s_tss_expectedresult, accountId, s_tss_enteredby
                            ) VALUES (%s, %s, %s, %s, %s, %s)
                            """
                            stepparams = (stepno, testcaseId, steps, expectedresult, accountId, enteredby)
                            cursor.execute(stepsql, stepparams)
                            conn.commit()
                            
                            
                        except Exception as e:
                            logger.error(f"Error inserting into s_testcase_steps: {str(e)}")
                            logger.error(traceback.format_exc())
                            conn.rollback()
                            raise

                        try:
                            chksql = "SELECT * FROM s_testcasefinal WHERE testcaseId = %s AND activityId = %s AND accountId = %s"
                            cursor.execute(chksql, (testcaseId, activityId, accountId))
                            chkstmt = cursor.fetchone()

                            if not chkstmt:
                                msql = """
                                INSERT INTO s_testcasefinal (
                                testcaseId, projectId, releaseId, activityId, s_f_testresult, s_f_actualresult,
                                defectId, s_f_enteredby, accountId, s_f_activestatus
                                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """
                                params = (testcaseId, projectId, releaseId, activityId, 'Not Executed', '', '0', enteredby, accountId, 'Active')
                                cursor.execute(msql, params)
                                conn.commit()
                            else:
                                finalsql = """
                                UPDATE s_testcasefinal
                                SET s_f_activestatus = 'Active'
                                WHERE testcaseId = %s AND activityId = %s AND accountId = %s
                                """
                                cursor.execute(finalsql, (testcaseId, activityId, accountId))
                            conn.commit()
                            
                            success_message = f"All data in the file {os.path.basename(file_path)} has been successfully inserted."
                            logger.info(success_message)
                            insert_notification(conn, accountId, enteredby, 0, success_message)
                            
                            success_message = f"All data in the file {os.path.basename(file_path)} has been successfully inserted."
                            logger.info(success_message)
                            insert_notification(conn, accountId, enteredby, 0, success_message)
                            
                        except Exception as e:
                            logger.error(f"Error updating s_testcasefinal: {str(e)}")
                            logger.error(traceback.format_exc())
                            conn.rollback()
                            raise

                except Exception as e:
                    logger.error(f"Error processing row {index + 1}: {str(e)}")
                    logger.error(traceback.format_exc())
                    if conn:
                        conn.rollback()
                    raise

    except Exception as e:
        logger.error(f"An error occurred during database operations: {str(e)}")
        logger.error(traceback.format_exc())
        if conn:
            conn.rollback()
        raise

    finally:
        if conn:
            conn.close()

def insert_notification(conn, accountId, enteredby, row_num, error_message):
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO s_notifications (
                `s_n_viewer`, `s_n_employees`, `s_n_assignto`, `s_n_recordid`,
                `s_n_recordnum`, `s_n_desc`, `s_n_attachments`, `s_n_filename`,
                `accountId`, `s_n_enteredby`, `s_n_newflag`, `s_n_emailflag`,`s_n_module`
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
            """
            params = (
                None, enteredby, '0', '0', 'testcase bulk upload',
                f"Error in row {row_num}: {error_message}", '', '',
                accountId, enteredby, '0', '0','testcaseupload'
            )
            cursor.execute(sql, params)
            conn.commit()
            logger.info(f"Notification inserted for row {row_num}: {error_message}")
    except Exception as e:
        logger.error(f"Error inserting notification: {str(e)}")
        logger.error(traceback.format_exc())
        conn.rollback()


def update_scriptaction_status(account_id, project_id, release_id, file_path, status):
    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        sql = """
        UPDATE scriptaction
        SET status = %s
        WHERE account_id = %s AND project_id = %s AND released_id = %s AND file_path = %s
        """
        values = (status, account_id, project_id, release_id, file_path)
        cursor.execute(sql, values)
        db.commit()
        logger.info(f"Status updated to '{status}' for account_id: {account_id}, project_id: {project_id}, release_id: {release_id}, file_path: {file_path}")
    except Exception as err:
        logger.error(f"Error updating status in scriptaction table: {str(err)}")
        logger.error(traceback.format_exc())
        if db:
            db.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

def process_pending_files():
    try:
        db = get_db_connection()
        cursor = db.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT account_id, enteredby_id, project_id, released_id, status, file_path FROM scriptaction WHERE status = 'pending' LIMIT 1")
        row = cursor.fetchone()
        logger.info("Fetched a row from the database.")

        if row:
            account_id = row['account_id']
            enteredby_id = row['enteredby_id']
            project_id = row['project_id']
            released_id = row['released_id']
            filepath = row['file_path']

            logger.info(f"Processing row - account_id: {account_id}, filepath: {filepath}")

            excel_file_path = os.path.join(input_folder, os.path.basename(filepath))
            logger.info(f"Constructed Excel file path: {excel_file_path}")

            if os.path.exists(excel_file_path):
                try:
                    update_scriptaction_status(account_id, project_id, released_id, filepath, "in progress")
                    process_file(excel_file_path, project_id, released_id, enteredby_id, account_id)
                    update_scriptaction_status(account_id, project_id, released_id, filepath, "done")
                    done_file_path = os.path.join(done_folder, os.path.basename(filepath))
                    logger.info(f"New file path in done folder: {done_file_path}")
                    shutil.move(excel_file_path, done_file_path)
                    logger.info(f"File {filepath} moved to done folder.")
                except Exception as e:
                    logger.error(f"Error processing Excel file {filepath}: {str(e)}")
                    logger.error(traceback.format_exc())
                    update_scriptaction_status(account_id, project_id, released_id, filepath, "exception")
                    exception_file_path = os.path.join(exception_folder, os.path.basename(filepath))
                    shutil.move(excel_file_path, exception_file_path)
                    logger.info(f"File {filepath} moved to exception folder due to processing error.")
            else:
                logger.error(f"File {filepath} not found in the input folder. Skipping processing for this file.")

        cursor.close()
        db.close()
    except Exception as err:
        logger.error(f"Error executing SQL query: {str(err)}")
        logger.error(traceback.format_exc())
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# Main loop to run the script every 5 minutes
while True:
    logger.info("Starting the script execution...")
    process_pending_files()
    logger.info("Script execution completed. Waiting for 5 minutes before the next run...")
    time.sleep(30)  # Wait for 300 seconds (5 minutes)


