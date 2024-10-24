import uandiLogo from "../assets/uandilogo.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
//ojoj
const Header = () => {
  return (
    <header className="relative h-[15%] w-full bg-red-200">
    <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
        10% Discount on first purchase | Welcome
      </div>
      <div className="h-[75%] w-full bg-yellow-300 flex">
        <div className="h-full aspect-[1/1] bg-pink-300 shrink-0">
          <img src={uandiLogo} alt="dsvd" className="h-full w-full" />
        </div>
        <div className="h-full aspect-[1/1] shrink-0">
          <CgProfile className="absolute text-3xl right-4 top-1/2" 
           onClick={() => {
            navigate('/profilepage')
          }}
          />
          <Link to="/cart">
            <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
          </Link>
        </div>
      </div> 
    </header>

  )
}

export default Header
