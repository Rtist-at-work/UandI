<header className="relative h-[15%]  w-full bg-blue-300 ">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className=" h-[75%] w-full bg-yellow-300 flex ">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="dsvd" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%]  shrink-0">
            <CgProfile className=" absolute text-3xl right-4 top-1/2" />
            <MdOutlineShoppingCart className=" absolute text-3xl right-16 top-1/2" />
          </div>

          <div className="w-[70%] "></div>
        </div>
      </header>
      <main className="h-[85%] w-full bg-red-100 ">
        <div className="h-full w-full flex flex-col gap-4">
          <h1 className="p-2">YOUR CART</h1>
          <div className="max-h-max w-full flex flex-col gap-4 p-2">
            {cartProducts.length > 0 ? (
              cartProducts.map((cartproduct,index) => {
                let product = JSON.parse(cartproduct.product);
                return (
                  <div key={index} className="max-h-max w-full flex gap-2 justify-around">
                   
                    <div className="h-32 w-32 bg-pink-900 shrink-0">  </div>
                    <div
                      className="max-h-max w-[55%] shrink-0  break-words flex flex-row 
                     gap-2 justify-between flex-wrap"
                    >
                      <div className="sm:w-[50%] xsm:w-full flex flex-col gap-2">
                        <div className="flex justify-between">
                          <h1>{product.name}</h1>
                          <MdDelete onClick={() => deleteCartItem(index)} className="text-2xl"/> 
                          
                        </div>
                        <div className=" flex items-center gap-4 ">
                          <button
                            id="minus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
                            onClick={(e) => countop(e,index)}
                          >
                            -
                          </button>
                          <div>{cartproduct.count}</div>
                          <button
                            id="plus"
                            className="h-6 w-6 flex items-center justify-center bg-red-300"
                            onClick={(e) => countop(e,index)}
                          >
                            +
                          </button>
                        </div>
                        <p>Color : </p>
                        <p>Size : {cartproduct.selectedSize}</p>
                      </div>
                      <p className="w-[50%]">{product.price}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>add items</div>
            )}
          </div>          
          <div className=" h-[10%] w-full  flex items-center justify-end p-4">
                  <p>SUBTOTAL : Rs.{subTotal}</p>
                </div>
          
          <div className="w-full flex justify-center">
            <button className="w-[90%] h-12 border-2 border-gray-400 bg-gray-400 mx-auto" onClick={handleOrder}>
              CHECK OUT
            </button>
          </div>

          <Footer />
        </div>
      </main>