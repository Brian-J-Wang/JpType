import './assets/Fonts/fonts.css'
import './App.css'
import './assets/normalize.css'
import Header from './Components/Header/Header'
import PracticePage from './Pages/practice/practicePage'
import SettingsPage from './Pages/settings/settingsPage'
import Profile from './Components/Profile/Profile'
import Footer from './Components/Footer/Footer'
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom'

function App() {

	const appLayout = () => {
		return (
		<div className='app'>
			<Header/>
			<Outlet/>
		</div>
		)
	}

	const router = createBrowserRouter([
		{
			element: appLayout(),
			children: [
				{
					path: "/",
					element: <PracticePage/>
				},
				{
					path: "/settings/*",
					element: <SettingsPage/>
				},
				{
					path: "/profile",
					element: <Profile/>
				}
			]
		}
	])

	return (
		<RouterProvider router={router}/>
	)
}

export default App
