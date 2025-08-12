import './assets/Fonts/fonts.css'
import './App.css'
import './assets/normalize.css';

import PracticePage from './Pages/practice/'
import SettingsPage from './Pages/settings/settingsPage'
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom'
import Profile from './Pages/profile/profile'
import Header from './Components/Header/Header';
import { generateRandomHexColor } from './utilities/generateRandomHexColor';

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
