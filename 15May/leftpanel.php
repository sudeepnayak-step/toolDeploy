<!-- Left Panel -->

<?php

$projectTab = "hidden";
$activityTab = "hidden";
$releaseTab = "hidden";
$testcaseTab = "hidden";
$testsuiteTab = "hidden";
$rtmTab = "hidden";
$defectTab = "hidden";
$testmgmtTab = "hidden";
$tcrepositoryTab = "hidden";
$bankTab = "hidden";
$automativeTab = "hidden";
$hrTab = "hidden";
$insuranceTab = "hidden";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin"){
    $projectTab = "";
    $activityTab = "";
    $releaseTab = "";
    $testcaseTab = "";
    $testsuiteTab = "";
    $rtmTab = "";
    $defectTab = "";
    $testmgmtTab = "";
    $tcrepositoryTab = "hidden";
    $bankTab = "";
    $automativeTab = "";
    $hrTab = "";
    $insuranceTab = "";
}else {
    if(isset($_SESSION["ruleIds"]) && in_array("1", explode(",", $_SESSION["ruleIds"]))){ 
        $projectTab = "";
    }

    if(isset($_SESSION["ruleIds"]) && in_array("9", explode(",", $_SESSION["ruleIds"]))){ 
        $activityTab = "";
    }

    if(isset($_SESSION["ruleIds"]) && in_array("5", explode(",", $_SESSION["ruleIds"]))){ 
        $releaseTab = "";
    }

    if(isset($_SESSION["ruleIds"]) && in_array("13", explode(",", $_SESSION["ruleIds"]))){ 
        $testcaseTab = "";
    }

    if(isset($_SESSION["ruleIds"]) && in_array("17", explode(",", $_SESSION["ruleIds"]))){ 
        $testsuiteTab = "";
    }
    
    if(isset($_SESSION["ruleIds"]) && in_array("21", explode(",", $_SESSION["ruleIds"]))){ 
        $rtmTab = "";
    }
    
    if(isset($_SESSION["ruleIds"]) && in_array("25", explode(",", $_SESSION["ruleIds"]))){ 
        $defectTab = "";
    }
    if($projectTab == "" || $activityTab == "" ||  $releaseTab == "" || $testcaseTab == "" || $testsuiteTab = "" || $rtmTab == ""){
        $testmgmtTab = "";
    }

    if(isset($_SESSION["ruleIds"]) && in_array("29", explode(",", $_SESSION["ruleIds"]))){ 
        
        $tcrepositoryTab = "";
        $bankTab = "";
        $automativeTab = "";
        $hrTab = "";
        $insuranceTab = "";
    }
}
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "StepAdmin"){ 

        $tcrepositoryTab = "";
        $bankTab = "";
        $automativeTab = "";
        $hrTab = "";
        $insuranceTab = "";
    }
$dashboardActive = "";$testmgmtActive = ""; $defectActive = "";$rolemgmtActive = ""; $userActive ="";$emailsettingActive = "";$auditlogActive = "";$errorlogActive = "";$projemailsettingActive = "";
$masterActive = "";$holidayActive = "";$clientActive = ""; $masteractivityActive = "";$dtypeActive = "";$dstatusActive = "";$ragActive = ""; $qualityActive = "";$chartActive = "";
$projectActive = "";$releaseActive = ""; $activityActive = ""; $testcaseActive = ""; $testsuiteActive = ""; $rtmActive = "";$categoryActive ="";$reqsettingActive = ""; 
$tcrepositoryActive = ""; 
$bankActive="";$automativeActive="";$hrActive="";$insuranceActive="";

if(isset($activetab)){
    if(in_array($activetab, array("projectActive","releaseActive","activityActive","testcaseActive","testsuiteActive","rtmActive","testmgmtActive"))){
        $testmgmtActive = "active show";
        if($activetab == "projectActive"){
            $projectActive = "active";
        }else if($activetab == "releaseActive"){
            $releaseActive = "active";
        }else if($activetab == "activityActive"){
            $activityActive = "active";
        }else if($activetab == "testcaseActive"){
            $testcaseActive = "active";
        }else if($activetab == "testsuiteActive"){
            $testsuiteActive = "active";
        }else if($activetab == "rtmActive"){
            $rtmActive = "active";
        }
    }else if(in_array($activetab, array("bankActive","automativeActive","hrActive","insuranceActive"))){
        $tcrepositoryActive = "active show";
        if($activetab == "bankActive"){
            $bankActive = "active";
        }else if($activetab == "automativeActive"){
            $automativeActive = "active";
        }else if($activetab == "hrActive"){
            $hrActive = "active";
        }else if($activetab == "insuranceActive"){
            $insuranceActive = "active";
        }
    }else if(in_array($activetab, array("holidayActive","masteractivityActive","clientActive","dtypeActive","dstatusActive","ragActive","qualityActive","chartActive","categoryActive","reqsettingActive"))){
        $masterActive = "active show";
        if($activetab == "holidayActive"){
            $holidayActive = "active";
        }else if($activetab == "masteractivityActive"){
            $masteractivityActive = "active";
        }else if($activetab == "dtypeActive"){
            $dtypeActive = "active";
        }else if($activetab == "dstatusActive"){
            $dstatusActive = "active";
        }else if($activetab == "ragActive"){
            $ragActive = "active";
        }else if($activetab == "qualityActive"){
            $qualityActive = "active";
        }else if($activetab == "chartActive"){
            $chartActive = "active";
        }else if($activetab == "clientActive"){
            $clientActive = "active";
        }else if($activetab == "categoryActive"){
            $categoryActive = "active";
        }else if($activetab == "reqsettingActive"){
            $reqsettingActive = "active";
        }
    }else if($activetab == "defectActive"){
        $defectActive = "active";
    }else if($activetab == "rolemgmtActive"){
        $rolemgmtActive = "active";
    }else if($activetab == "userActive"){
        $userActive = "active";
    }else if($activetab == "emailsettingActive"){
        $emailsettingActive = "active";
    }else if($activetab == "projemailsettingActive"){
        $projemailsettingActive = "active";
    }else if($activetab == "auditlogActive"){
        $auditlogActive = "active";
    }else if($activetab == "errorlogActive"){
        $errorlogActive = "active";
    }else{
        $dashboardActive = "active";
    }

}else{
        $dashboardActive = "active";
    }
?>
    <aside id="left-panel" class="left-panel" >
        <nav class="navbar navbar-expand-sm navbar-default bg-gradient">

            <div class="navbar-header" >
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand" href="<?php echo STEP_root; ?>index.php"><img src="<?php echo STEP_root; ?>images/tc-logo.png" alt="Logo" width="100%" ></a>
                <a class="navbar-brand hidden" href="<?php echo STEP_root; ?>index.php"><img src="<?php echo STEP_root; ?>images/logo2.png" alt="Logo"></a>
            </div>

            <div id="main-menu" class="main-menu collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="<?php echo $dashboardActive; ?>" >
                        <a href="<?php echo STEP_root; ?>index.php" class="main" >
                         <i class="menu-icon fa fa-server"></i>
                         <span>Dashboard</span></a>
                    </li>
                    
                    <li class="menu-item-has-children dropdown <?php echo $testmgmtTab; ?> <?php echo $testmgmtActive ; ?>">
                        <a href="#" class="dropdown-toggle1 main" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
                           <i class="menu-icon fa fa-laptop"></i>
                           <span> Test Management</span></a>
                        <ul class="sub-menu children dropdown-menu <?php echo $testmgmtActive ; ?>">
                            <li class=" <?php echo $projectTab." ".$projectActive;?>">
                            <i class="submenu-icon fa fa-briefcase"></i>
                            <a href="<?php echo STEP_root; ?>master/projects.php">Projects</a></li>
                            <li class=" <?php echo $releaseTab." ".$releaseActive ;?>">
                            <i class="submenu-icon fa fa-share-square"></i>
                            <a href="<?php echo STEP_root; ?>master/release.php">Release</a></li>
                            <li class=" <?php echo $activityTab." ".$activityActive;?>">
                            <i class="submenu-icon fa fa-file"></i>
                            <a href="<?php echo STEP_root; ?>master/activity.php">Test Plan</a></li>
                            <li class=" <?php echo $rtmTab." ".$rtmActive;?>">
                            <i class="submenu-icon fa fa-list"></i>
                            <a href="<?php echo STEP_root; ?>master/rtm.php">Requirement</a></li>
                            <li class=" <?php echo $testcaseTab." ".$testcaseActive;?>">
                            <i class="submenu-icon fa fa-paste"></i> 
                            <a href="<?php echo STEP_root; ?>master/testcasenew.php">Test Case</a></li>
                            <li class=" <?php echo $testsuiteTab." ".$testsuiteActive;?>">
                            <i class="submenu-icon fa fa-boxes"></i>
                            <a href="<?php echo STEP_root; ?>master/testsuite.php">Test Suite</a></li>
                        </ul>
                    </li>
                    <li class=" <?php echo $defectTab." ".$defectActive;?>">
                        <a href="<?php echo STEP_root; ?>master/defects.php" class="main"> 
                        <i class="menu-icon  fa fa-ticket-alt"></i> 
                        <span>Defect Management</span></a>
                    </li> 
                    <li class="menu-item-has-children dropdown <?php echo $tcrepositoryTab; ?> <?php echo $tcrepositoryActive ; ?>">
                        <a href="#" class="dropdown-toggle1 main" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
                            <!-- <i class="menu-icon fa fa-laptop"></i> -->
                            <span>Test Case Repository</span></a>
                        <ul class="sub-menu children dropdown-menu <?php echo $tcrepositoryActive ; ?>">
                            <li class=" <?php echo $bankTab." ".$bankActive;?>">
                            <!-- <i class="submenu-icon fa fa-bank"></i> -->
                            <a href="<?php echo STEP_root; ?>master/tcrepository.php?type=Banking">Banking</a></li>
                            <li class=" <?php echo $automativeTab." ".$automativeActive;?>">
                            <!-- <i class="submenu-icon fa fa-tasks"></i> -->
                            <a href="<?php echo STEP_root; ?>master/tcrepository.php?type=Automative">Automative</a></li>
                            <li class=" <?php echo $hrTab." ".$hrActive;?>">
                            <!-- <i class="submenu-icon fa fa-users"></i> -->
                            <a href="<?php echo STEP_root; ?>master/tcrepository.php?type=HR">Human Resource</a></li>
                            <li class=" <?php echo $insuranceTab." ".$insuranceActive;?>">
                            <!-- <i class="submenu-icon fa fa-life-ring"></i> -->
                            <a href="<?php echo STEP_root; ?>master/tcrepository.php?type=Insurance">Insurance</a></li>
                        </ul>
                    </li>
                    <?php 
                    if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin"){ ?>
                    <li class="<?php echo $rolemgmtActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/role.php" class="main"> 
                        <i class="menu-icon fa fa-address-book"></i>
                        <span>Role Management</span> </a>
                    </li> 
                    <li class="<?php echo $userActive; ?>">
                        <a href="<?php echo STEP_root; ?>master/user.php" class="main"> 
                        <i class="menu-icon  fa fa-users"></i>
                        <span>User Management</span> </a>
                    </li> 
                    <!-- <h3 class=" menu-title  ">Configuration Setting</h3> -->
                    <!-- /.menu-title -->

                    <li class="menu-item-has-children dropdown  <?php echo $masterActive;?>">
                        <a href="#" class="dropdown-toggle1 main" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
                            <i class="menu-icon fa fa-swatchbook"></i>
                            <span>Master</span></a>
                        <ul class="sub-menu children dropdown-menu <?php echo $masterActive; ?>">
                            <li class="<?php echo $holidayActive; ?>">
                            <i class="submenu-icon fa fa-glass-martini-alt"></i>
                            <a href="<?php echo STEP_root; ?>basicmaster/clientholiday.php">Client Holiday</a></li>
                            <li class="<?php echo $masteractivityActive; ?>">
                            <i class="submenu-icon fa fa-file-alt"></i>
                            <a href="<?php echo STEP_root; ?>basicmaster/activity.php">Activity</a></li>
                            <li class="<?php echo $clientActive; ?>"><i class="submenu-icon fa fa-users"></i> <a href="<?php echo STEP_root; ?>basicmaster/client.php">Clients</a></li>
                            <li class="<?php echo $dtypeActive; ?>"><i class="submenu-icon fa fa-ticket-alt"></i><a href="<?php echo STEP_root; ?>basicmaster/defecttype.php">Defect Type</a></li>
                            <li class="<?php echo $dstatusActive; ?>"><i class="submenu-icon fa fa-chart-line"></i><a href="<?php echo STEP_root; ?>basicmaster/defectstatus.php">Defect Status</a></li>
                            <li class="<?php echo $ragActive; ?>"> <i class="submenu-icon fa fa-toolbox"></i><a href="<?php echo STEP_root; ?>basicmaster/ragthreshold.php">RAG Threshold Setting</a></li>
                            <li class="<?php echo $qualityActive; ?>"><i class="submenu-icon fa fa-cogs"></i><a href="<?php echo STEP_root; ?>basicmaster/qualitystatus.php">Quality Threshold Setting</a></li>
                            <li class="<?php echo $categoryActive; ?>"><i class="submenu-icon fa fa-sliders-h"></i><a href="<?php echo STEP_root; ?>basicmaster/category.php">Testcase Category</a></li>
			   <li class="<?php echo $reqsettingActive; ?>"><i class="submenu-icon fa fa-sliders-h"></i><a href="<?php echo STEP_root; ?>basicmaster/reqsetting.php">Requirement Setting</a></li>
                            <!-- <li class="<?php echo $chartActive; ?>"><i class="submenu-icon fa fa-cogs"></i><a href="<?php echo STEP_root; ?>basicmaster/chartsetting.php">Chart Setting</a></li> -->
                        </ul>
                    </li>
                    <li class="<?php echo $emailsettingActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/emailsetting.php" class="main"><i class="menu-icon fa fa-envelope"></i><span>General    Email Setting</span> </a>
                    </li> 
                    <li class="<?php echo $projemailsettingActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/projemailsetting.php" class="main"> <i class="menu-icon  fa fa-envelope-open"></i><span>Project Email Setting</span> </a>
                    </li> 
                    <li class="<?php echo $auditlogActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/auditlogs.php" class="main"> <i class="menu-icon  fa fa-search"></i><span>Audit Logs</span> </a>
                    </li>

                    <li class="<?php echo $errorlogActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/errorlogs.php" class="main"><i class="menu-icon  fa fa-exclamation-triangle"></i><span>Error Logs</span> </a>
                    </li>
                <?php } ?>
		<?php if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin"){ ?>
                    <li class="<?php echo $chartActive; ?>">
                        <a href="<?php echo STEP_root; ?>basicmaster/chartsetting.php" class="main"> <i class="menu-icon  fa fa-poll-h"></i><span>Chart Setting</span> </a>
                    </li> 
                    <?php } if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "StepAdmin"){ ?>
                        <li><a href="<?php echo STEP_root; ?>basicmaster/rulemodule.php"><!-- <i class="menu-icon  fa fa-bars"></i>--><span>Rule Module</span></a></li>
                        <li><a href="<?php echo STEP_root; ?>basicmaster/basicrules.php"><!-- <i class="menu-icon  fa fa-bars"></i>--><span>Basic Rules</span></a></li>
                        <li  class="<?php echo $emailsettingActive; ?>">
                            <a href="<?php echo STEP_root; ?>basicmaster/emailsetting.php"> <!-- <i class="menu-icon  fa fa-gear"></i>--><span>Email Setting </span></a>
                        </li> 
                    <?php } ?>
			
		    <li>
                        <div class="alert m-2 alert-info  text-step fade show download-artifact" role="alert">
                        Want to enhance your test evidence collection and automate capturing screenshot seamlessly?
                        <a class="text-step" href="<?php echo STEP_root; ?>stepartifact/StepArtifact-v2.exe" target="_blank" title="Download Step Artifact v2" >
                        <i>Download <i class="fa fa-download   " style=""></i><br/>Test Artifact Capture</i>
                        </a>
                        </div>
                    </li>	

                </ul>
<!--		<div class="btn btn-step">Want to enhance your test evindence cllection and automate capturing screenshots seamlessly ?</div>-->
            </div><!-- /.navbar-collapse -->
        </nav>
    </aside><!-- /#left-panel -->

    <!-- Left Panel -->

