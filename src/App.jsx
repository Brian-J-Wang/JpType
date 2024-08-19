import './assets/Fonts/fonts.css'
import './App.css'
import './assets/normalize.css'
import Header from './Components/Header/Header'
import Practice from './Components/Practice/Practice'
import Settings from './Components/Settings/Settings'
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
					element: <Practice/>
				},
				{
					path: "/settings",
					element: <Settings/>
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
