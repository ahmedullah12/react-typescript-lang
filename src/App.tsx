import { RouterProvider } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom";
import {Suspense, lazy} from 'react';
import Loader from "./component/Loader";

const MainLayout = lazy(() => import('./layout/MainLayout'));
const Home = lazy(() => import("./component/Home"))
const Learning = lazy(() => import("./component/Learning"))
const Quiz = lazy(() => import("./component/Quiz"))
const Result = lazy(() => import("./component/Result"))
const Login = lazy(() => import("./component/Login"))

const routes = createBrowserRouter([
  {
      path: '/',
      element: <MainLayout/>,
      children: [
          {
              path: "/",
              element: <Suspense fallback={<Loader/>}>
                <Home/>
              </Suspense>
          },
          {
              path: "/learn",
              element: <Suspense fallback={<Loader/>}>
                <Learning/>
              </Suspense>
          },
          {
              path: "/quiz",
              element: <Suspense fallback={<Loader/>}>
                <Quiz/>
              </Suspense>
          },
          {
              path: "/result",
              element: <Suspense fallback={<Loader/>}>
                <Result/>
              </Suspense>
          },
          {
              path: "/login",
              element: <Suspense fallback={<Loader/>}>
                <Login/>
              </Suspense>
          },
      ]
  }
])

function App() {

  return (
    <>
      <RouterProvider router={routes}>

      </RouterProvider>
    </>
  )
}

export default App
