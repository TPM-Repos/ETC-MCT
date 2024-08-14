// Version 1.2.9
/**
 * LOGIN
 */

const SERVER_URL = config.serverUrl
const LOGIN_REDIRECT_URL = config.login.redirectUrl
let GROUP_ALIAS = config.groupAlias
const URL_QUERY = new URLSearchParams(window.location.search)
const delay = ms => new Promise(res => setTimeout(res, ms));

// Elements
const loginForm = document.getElementById("login-form")
const loginButton = document.getElementById("login-button")
const loginGuest = document.getElementById("login-guest-button")
const loginSSOButton = document.getElementById("login-sso-button")
const loginNotice = document.getElementById("login-notice")
const forgotLink = document.getElementById("forgot-link")
const createAccountButton = document.getElementById("create-account-button")
const copyright = document.querySelector(".login-copyright")
const usernameLabel = document.querySelector("#username-label")
const usernameInput = document.querySelector("#login-username")
const loginDivider = document.querySelector(".login-divider")

// Error Messages
const genericErrorMessage = "Unable to login."
const clientErrorMessage = "Cannot access client."
const privateErrorMessage = "Please use a non-private window."

// DriveWorks Live Client
let client;

	/**
	 * On page load.
	 */
(async function () {
	// Check localStorage support (show warning if not e.g. <= iOS 10 Private Window)
	if (!localStorageSupported()) {
		removeSkeleton()
		loginError(privateErrorMessage)
		return
	}

	setUsernameType()
	setLoginCover()
	addCarouselImages()

	loginForm.addEventListener("submit", handleLoginForm)

	if (loginSSOButton) {
		if (config.allowSingleSignOn) {
			loginSSOButton.addEventListener("click", handleLoginSSO)
			loginSSOButton.classList.remove("hidden")
			loginSSOButton.classList.add("skeleton-block")
		}
	}

	if (loginGuest) {
		if (config.guestLogin.enabled) {
			loginGuest.addEventListener("click", handleGuestLogin)
			loginGuest.classList.remove("hidden")
			loginGuest.classList.add("skeleton-block")
		}
	}

	if (forgotLink) {
		if (config.accountManagement.forgotPassword) {
			forgotLink.href = config.accountManagement.forgotPassword
			forgotLink.classList.remove("hidden")
		}
	}

	if (createAccountButton) {
		if (config.accountManagement.createAccount) {
			createAccountButton.addEventListener("click", createAccount)
			createAccountButton.classList.remove("hidden")
			loginDivider.classList.remove("hidden")
			createAccountButton.classList.add("skeleton-block")
		}
	}
	showLoginNotice()
	setLoginColumnLocation()
	setCopyright()
	handlePasswordToggle()
	// how long until timing out trying to connect?
	await delay(5000)
	removeSkeleton()
})()

/**
 * Create client.
 */
async function dwClientLoaded() {
	try {
		client = new window.DriveWorksLiveClient(SERVER_URL)
	} catch (error) {
		loginError(clientErrorMessage, error)
		removeSkeleton()
	}

	// Quick Logout (?bye)
	// https://docs.driveworkspro.com/Topic/WebThemeLogout
	if (URL_QUERY.has("bye")) {
		await forceLogout()
	}

	if(client == null) {
		dwClientLoadError()
	} else {
		startPageFunctions()
		enableButtons()
	}

}

/**
 * Start page functions.
 */
function startPageFunctions() {
	try {
		// Check if logged in, and redirect
		checkExistingLogin()
	} catch (error) {
		handleGenericError(error)
	}
	removeSkeleton()
}

async function login(type) {
	// Show error if cannot connect to client
	if (!client) {
		loginError(clientErrorMessage)
		return
	}

	try {
		// Show loading state, reset notice
		loginButton.classList.add("is-loading")
		hideLoginNotice()

		let result = null
		let inputUsername = null
		// Start Session
		if (type === "default" || type === null || type === "") {
			// Get credentials
			inputUsername =
				document.getElementById("login-username").value
			const inputPassword =
				document.getElementById("login-password").value
			const userCredentials = {
				username: inputUsername,
				password: inputPassword,
			}
			result = await client.loginGroup(GROUP_ALIAS, userCredentials)
		} else if (type === "SSO") {
			result = await client.loginSSO(GROUP_ALIAS)
		} else if (type === "Guest") {
			if (config.guestLogin.alias && config.guestLogin.alias !== "") {
				GROUP_ALIAS = config.guestLogin.alias
				console.log(GROUP_ALIAS)
			}
			inputUsername = "Guest"

			result = await client.loginGroup(GROUP_ALIAS)
		}

		// Show error is login failed
		if (!result) {
			loginError(genericErrorMessage)
			return
		}

		loginSuccess(result, inputUsername)
	} catch (error) {
		loginError(genericErrorMessage, error)
	}
}

function handleLoginForm(event) {
	event.preventDefault()
	login("default", event)
}

function handleGuestLogin() {
	login("Guest")
}

function handleLoginSSO() {
	login("SSO")
}

function createAccount() {
	window.location.href = `${window.location.origin}/${config.accountManagement.createAccount}`
}

function removeSkeleton() {
	loginButton.classList.remove("skeleton-block")
	loginSSOButton.classList.remove("skeleton-block")
	loginGuest.classList.remove("skeleton-block")
	createAccountButton.classList.remove("skeleton-block")
}

function enableButtons() {
	loginButton.disabled = false
	loginSSOButton.disabled = false
	loginGuest.disabled = false
	createAccountButton.disabled = false
	createAccountButton.classList.add("pill")
}

/**
 * Handle successful login. Store Session data to localStorage & redirect.
 */
function loginSuccess(result, username) {
	// Store session details to localStorage
	localStorage.setItem("sessionId", result.sessionId)
	localStorage.setItem("sessionAlias", GROUP_ALIAS)

	if (username) {
		localStorage.setItem("sessionUsername", username)
	}

	// Return to previous location (if redirected to login)
	const returnUrl = URL_QUERY.get("returnUrl")

	if (returnUrl && config.loginReturnUrls) {
		window.location.href = `${window.location.origin}/${decodeURIComponent(
			returnUrl,
		)}`
		return
	}
	// 

	// Redirect to default location
	window.location.href = LOGIN_REDIRECT_URL
}

/**
 * Handle login errors.
 *
 * @param {string} noticeText - The message to display when directed to the login screen.
 * @param {Object} [error] - The error object.
 */
function loginError(noticeText, error = null) {
	if (error) {
		handleGenericError(error)
	}

	// Remove loading state
	loginButton.classList.remove("is-loading")

	// Show client error
	setLoginNotice(noticeText, "error")
	showLoginNotice()
}

/**
 * Set login screen notice.
 *
 * @param {string} text - The message to display when directed to the login screen.
 * @param {string} [state] - The type of message state (error/success/info).
 */
function setLoginNotice(text, state = "info") {
	const notice = JSON.stringify({text: text, state: state})
	localStorage.setItem("loginNotice", notice)
}

/**
 * Show notice on login form.
 */
function showLoginNotice() {
	const notice = JSON.parse(localStorage.getItem("loginNotice"))

	if (!notice) {
		return
	}

	let state = notice.state

	if (!state) {
		state = "neutral"
	}

	// Display feedback
	loginNotice.innerText = notice.text
	loginNotice.classList.remove("error", "success", "neutral")
	loginNotice.classList.add(state, "is-shown")

	// Clear message
	localStorage.removeItem("loginNotice")
}

/**
 * Hide notice on login form.
 */
function hideLoginNotice() {
	loginNotice.classList.remove("is-shown")
}

/**
 * Handle password visibility toggle.
 */
function handlePasswordToggle() {
	const passwordToggle = document.getElementById("password-toggle")

	passwordToggle.onclick = function () {
		const passwordInput = document.getElementById("login-password")
		const currentType = passwordInput.type

		if (currentType === "password") {
			passwordInput.type = "text"
			passwordToggle.innerHTML =
				'<svg class="icon"><use xlink:href="dist/icons.svg#eye-closed"/></svg> Hide'
			return
		}

		passwordInput.type = "password"
		passwordToggle.innerHTML =
			'<svg class="icon"><use xlink:href="dist/icons.svg#eye-open"/></svg> Show'
	}
}

/**
 * Check existing login. Automatically login if found.
 */
async function checkExistingLogin() {
	const storedGroupAlias = localStorage.getItem("sessionAlias")

	if (!storedGroupAlias) {
		return
	}

	try {
		// Test connection
		await client.getProjects(storedGroupAlias, "$top=1")

		// Redirect to initial location
		window.location.replace(LOGIN_REDIRECT_URL)
	} catch (error) {
		handleGenericError(error)
	}
}

/**
 * Force logout and session data clearing.
 */
async function forceLogout() {
	// Logout from all Groups.
	try {
		await client.logoutAllGroups()
	} catch (error) {
		handleGenericError(error)
	}

	// Clear session information from storage.
	localStorage.clear()

	// Show login screen message.
	setLoginNotice("You have been logged out.", "success")
	showLoginNotice()
}

/**
 * Check for localStorage support - used to store session information.
 * Example: Incognito (Private) windows in iOS 10 and below do not allow localStorage, errors when accessed.
 */
function localStorageSupported() {
	try {
		localStorage.setItem("storageSupportTest", "Test")
		localStorage.removeItem("storageSupportTest")
		return true
	} catch (e) {
		return false
	}
}

/**
 * Handle generic errors e.g. tryCatch.
 *
 * @param {Object} error - The error object.
 */
function handleGenericError(error) {
	console.log(error)
}

/**
 * Set the loginCover
 */
function setLoginCover() {
	if (config.images.loginCover) {
		document.documentElement.style.setProperty(
			"--background-image",
			`url(${"../../../" + config.images.loginCover})`,
		)
	}
}

function setLoginColumnLocation() {
	if (!config.login.columnLocation) {
		return
	}

	if (config.login.columnLocation === "") {
		return
	}

	const loginContainer = document.querySelector(".login-container")

	if (config.login.columnLocation === "left") {
		loginContainer.style.flexDirection = "row"
		return
	}

	if (config.login.columnLocation === "right") {
		loginContainer.style.flexDirection = "row-reverse"
		return
	}

	if (config.login.columnLocation === "center") {
		const loginForm = loginContainer.querySelector("#login-form")
		const loginCover = loginContainer.querySelector(".login-cover")
		loginContainer.style.justifyContent = "center"
		loginContainer.style.backgroundImage = config.images.loginCover

		loginCover.style.display = "none"

		return
	}
}

function addCarouselImages() {
	if (!config.images.carousel || config.images.carousel.enabled === false) {
		return
	}

	const loginCover = document.querySelector(".login-cover")

	config.images.carousel.images.forEach((image) => {
		const img = document.createElement("img")
		img.src = image
		loginCover.appendChild(img)
	})

	loginCover.firstElementChild.classList.add("active")

	interval = 7500

	if (config.images.carousel.interval) {
		interval = config.images.carousel.interval * 1000
	}

	// call the transitionImages function every X seconds (milliseconds)
	setInterval(transitionImages, interval)
}

// a function to transition the opacity of the images every X seconds
function transitionImages() {
	const images = document.querySelectorAll(".login-cover img")
	const activeImage = document.querySelector(".login-cover img.active")

	// get the index of the active image
	const activeIndex = Array.from(images).indexOf(activeImage)

	// remove the active class from the active image
	activeImage.classList.remove("active")

	// get the next image in the array
	const nextImage = images[(activeIndex + 1) % images.length]

	// add the active class to the next image
	nextImage.classList.add("active")
}

// function to set the copyright information
function setCopyright() {
	if (!copyright || !config.copyright.show) {
		// nothing to do if the copyright div can't be found
		// or if the config.copyright.show doesn't exist
		// or if config.copyright.show is false
		return
	}

	// otherwise, set the text
	copyright.innerText =
		config.copyright.holder + " - " + config.copyright.year
}

function setUsernameType() {
	if(!config.usernameType || !usernameInput || !usernameLabel)
		return

	let type = config.usernameType
	// force to all lowercase and remove - if set to e-mail
	type = type.toLowerCase().replace("-", "")

	if (type === "email address") {
		usernameLabel.innerText = "Email Address"
		usernameInput.type = "email"
	}
}

/**
 * DriveWorks Live client library load error.
 */
function dwClientLoadError() {
	loginError(clientErrorMessage)
	removeSkeleton()
}
