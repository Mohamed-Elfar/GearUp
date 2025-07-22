import { RouterProvider } from "react-router-dom";
import router from "./router";
import { SEO } from "./components";

function App() {
  return (
    <>
      <SEO />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
