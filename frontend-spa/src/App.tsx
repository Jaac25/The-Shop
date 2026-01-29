import "react-toastify/dist/ReactToastify.css";
import { CustomAlert } from "./components/CustomAlert";
import "./index.css";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  return (
    <>
      <ProductsPage />
      <CustomAlert />
    </>
  );
}

export default App;
