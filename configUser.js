const config = {
	version: "1.3.1",
	// the full path the site running the DriveWorks Live API
	serverUrl: "http://22.dwapi.etcconnect.com",
	// serverUrl: "",
	// The default alias for the DriveWorks Group
	// This is a custom string that must match the name in the ConfigUser.xml file
	groupAlias: "ETC",
	guestAlias: "",
	// (Optional) Configure ping & update intervals - in seconds
    // (Optional) Set Specification ping interval - in seconds
    // A Specification will timeout after a configured period of inactivity (see DriveWorksConfigUser.xml).
    // This function prevents a Specification timing out as long as the page is in view.
    // Disable the ping by setting to 0
    specificationPingInterval: 30,
	// (Optional) Enter custom redirect URLs for login/logout and Project/DriveApp close/cancel
	// folder: "",
	login: {
		redirectUrl: "projects.html",
		// set this if you want to redirect guest users to a different page
		redirectGuestUrl: "projects.html",
		// Set this to left, center, or right to position the login form on the page
		columnLocation: "center",
		// message to be shown under title
		information: ""
	},
	logout: {
		redirectUrl: "index.html",
	},
	history: {
		specLimitOnPage: 10,
		dateOrder: "desc",
		showRunningSpecs: true,
	},
	project: {
		// you may put "logout" instead of a page location
		redirectOnClose: "details.html",
		redirectOnCancel: "projects.html",
		showHeader: false,
	},
	driveApp: {
		// you may put "logout" instead of a page location
		redirectOnClose: "details.html",
		redirectOnCancel: "drive-apps.html",
		showHeader: true,
	},
	// (Optional) Configure 'Run' view
	run: {
		showWarningOnExit: true, // Toggle warning dialog when exiting "Run" view with potentially unsaved changes (where supported)
		loadCustomProjectAssets: {
			scripts: false,
			styles: false,
		},
	},
	/* projects: {
		// Hide specific projects by their group alias
        toHide: [
			{alias: "Group Alias"},
		],
		// add additional links to the projects page
        toAdd: [
            {
                alias: "Group Alias",
                description: "Optional description",
                image: "dist/img/logo-dark.svg",
				// this could be an internal link like this
                link: "run.html?project=Jib Cranes&DWMacroQuickLaunch=700Series",
				// or an external link like this
                // link: "https://www.google.com",
            },
        ],
    }, */
	// (Optional) Configure 'Details' view
	details: {
		updateInterval: 5, // Interval to refresh content - in seconds
		showStartNewSpecificationAction: true,
	},
	// (Optional) Configure the query function
	// Enter a default Group Alias and/or Project name to be used (when none are passed in the query string)
	// Choose how sessions are handled
	query: {
		defaultGroupAlias: "",
		defaultProjectName: "",
		autoLogin: false,
		requireNewSession: true,
		requireExactAlias: false,
	},
	copyright: {
		show: false,
		holder: "ETC",
		year: "2024",
	},
	// Add a watermark over pages in order to indicate that the site is a development site
	// comment out or set to "" to disable
	watermark: "",
	// Set the title of the site, this will be displayed in the browser tab
	// pageName | siteName
	siteName: "ETC DEV",
	// Set whether a username or email address will be used
	// username | email address
	usernameType: "Username",
    passwordRequired: false,
	loginReturnUrls: true, // Toggle appending return urls to restore the previous location when redirected to the login form
	locale: "en-US", // Set the default locale for displaying dates and numbers
	dateFormat: {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	},
	// Whether to show debugging information in the console
	debug: false,
	allowSingleSignOn: false,
	disableRegularLogin: false,
	guestLogin: false,
	// In order to use the Account Management features you will need a project in your DriveWorks Group
	// You will also need to allow all users (and Guest) to run the Macro called Navigate
	// CreateAccount and ForgotPassword require the macro to be enabled in the Guest Alias
	accountManagement: {
		// uses guestAlias, but can be set to a different alias by uncommenting the following line
		// guestAlias: "Guest",
		projectName: "AccountManagement",
		// these three options can be true, false, or a string
			// if a string is provided it will be the entire URL for example: "query?alias=development&run=AccountManagement&DWMacroNavigate=ResetPassword"
			// only set the string if you are not using the TPM Account Management project
		createAccount: false,
		forgotPassword: false,
		resetPassword: false,
	},
	sidebarLinks: [
		{
			title: "Projects",
			icon: "projects",
			href: "projects.html",
		},
		// {
		// 	title: "DriveApps",
		// 	icon: "drive-apps",
		// 	href: "drive-apps.html",
		// },
		{
			title: "History",
			icon: "history",
			href: "history.html",
		},
	],
	images: {
		// You may use a different (or same) company logo for the login and sidebar
		// You may wish to do this due to the color of the logo and contrast with the background color
		// Here is an example with svgs and with pngs
		// login: "dist/img/logo-dark.svg",
		// sidebar: "dist/img/logo-light.svg",
		login: "dist/img/ETC_logo_color.png",
		sidebar: "dist/img/ETC_logo_color.png",
		// By default the login screen will show a static cover image
		// You can change it to a different image here.
		loginCover: "dist/img/ETCPhotoLightened.webp",
		// You can use a series of images instead of a static cover image by enabling the carousel
		// These will fade into the next image every 'interval' seconds
		// You may use as many as you want but the more you use the longer the page will take to load
		carousel: {
			enabled: false,
			interval: 7.5,
			images: [
				"dist/img/carousel-1.jpg",
					],
		},
	},
	// Use this section to easily set the branding of your site.
	// Available fonts are Roboto (Flex), Inter, and Poppins
	// you may @import any additional fonts you require in dist/css/theme/theme.css: for more info: https://www.w3schools.com/css/css3_fonts.asp
	// Sizes can be various units (%, pt, px, em, rem, vh, vw, etc): for more info: https://www.w3schools.com/css/css_units.asp
	// don't use % with radius
	// Colors can be names, hexadecimal, rgb(a), hsl(a): for more info: https://www.w3schools.com/cssref/css_colors_legal.php
	// line height can be px, pt, or unit-less. unit-less is * font size
	styles: {
        text: {
            font: "Montserrat",
            size: "11pt",
            color: "#17365B",
			weight: "Light",
            lineHeight: "1.8",
        },
        heading: {
            font: "",
            size: "48pt",
            color: "#09B5E7",
            weight: "Semibold",
            lineHeight: "1.2",
        },
        caption: {
            font: "",
            size: "16px",
            color: "rgba(23, 54, 91, 0.75)",
            weight: "400",
        },
        color: {
            primary: "#00AEEF",
            secondary: "#17365B",
            background: "white",
            icon: "#17365BBF",
            focus: "#00AEEF",
        },
        sidebar: {
            background: "#17365B",
            width: "18em",
            logoPadding: "48px 0px 48px 0px",
			textColor: "white",
			iconColor: "#ffffffBF"
        },
		header: {
			background: "#17365B",
			height: "30px",
			textColor: "white",
		},
        loginForm: {
            background: "#17365B",
            padding: "64px 40px 32px 40px",
			textColor: "White",
			linkColor: "#00AEEF"
        },
		link: {
			font: "",
			size: "16px",
			color: "#00AEEF",
			colorHover: "",
			weight: "500",
			underline: false,
			underlineOnHover: true,
		},
        button: {
			// not recommended to use %
            radius: "1rem",
            color: "#00AEEF",
			textColor: "white",
			colorHover: "#008BBF",
			textColorHover: "white",
			border: "none",
		},
        logo: {
            width: "25%"
        },
        projectCard: {
            background: "#eeeeee",
            margin: "22px",
			borderRadius: "8px",
        },
		// not recommended to use %
        inputRadius: "2em",
    },
}

