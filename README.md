Project H.A.S Component Documentation - Frontend Component
------------------------------------------------------------
Author Group: **Home Automation Systems**

Prepared for: Dr. Curtis Busby-Earle

Prepared by: Aston Hamilton, Renee Whitelocke, Orane Edwards

April 1, 2014

Version number: 000-0001


##Component Description
The purpose of this component is to provide a user interface to allow end users to view a dashboard of connected devices. This dash board is a simulation of what the real system would be like, as devices are automatically added and removed from the system as they are installed and uninstalled from the house.


This component orchestrates the flow of data through the following components:

**Device Manager Component:**

	https://github.com/uwi-mase-2014-ccd/component-home-automation-systems-device-management

**Authentication Component:**

	https://github.com/uwi-mase-2014-ccd/component-home-automation-systems-login-component

##Services
This component does not expose any web services but its user interface is accessible by browsing to the following URL:

	http://cs-proj-srv:8083/
	
This component has been deployed to a public server at the endpoint: 

    http://ticketmanager.mysoftware.io:8100/

Note: The UWI Server deployment uses stubs because other dependent services are not yet hosted on the UWI Server

