import React from 'react'
import "../styles/Board.css";
import hello from  "../assets/hello.svg"

const Board = () => {
  return (
   
      <main>
          <div className="main__container">{/* === Container === */}

              <div className="main__title">{/* === Title === */}
                  <img src={hello} alt="hello" />
                  <div className="main_greeting">
                      <h1>Admin Panel</h1>
                      <p>welcome to admin panel</p>
                  </div>
              </div>

              <div className="main__cards">
                  <div className="card">{/* === CARDS === */}
                      <i className="fa fa-file-text fa-2x text-lightblue"></i>
                      <div className="card_inner">
                          <p className="text-primary-p">Total Student</p>
                          <span className="font-bold text-title">10000+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                      <i className="fa fa-money-bill fa-2x text-red"></i>
                      <div className="card_inner">
                          <p className="text-primary-p">Department</p>
                          <span className="font-bold text-title">60+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                      <i className="fa fa-archive fa-2x text-yellow"></i>
                      <div className="card_inner">
                          <p className="text-primary-p">Awards</p>
                          <span className="font-bold text-title">10+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                      <i className="fa fa-bars fa-2x text-green"></i>
                      <div className="card_inner">
                          <p className="text-primary-p">Revenue</p>
                          <span className="font-bold text-title">40</span>
                      </div>
                  </div>
              </div>

              <div className="charts">{/* === CHARTS ==== */}

                  <div className="charts__left">{/* === LEFT ==== */}
                      <div className="charts__left__title">
                          <div>
                              <h1>Daily Reports</h1>
                              <p>Admissions</p>
                          </div>
                          <i className="fa fa-usd"></i>
                      </div>
                      {/* <Charts /> */}
                      
                  </div>

                  <div className="charts__right">{/* === RIGHT === */}
                      <div className="charts__right__title">
                          <div>
                              <h1>Daily Reports</h1>
                              <p>Student Admission</p>
                          </div>
                          <i className="fa fa-area-chart"></i>
                      </div>

                     <div className="charts__right__cards">
                         <div className="card1">
                             <h1>500+</h1>
                             <h5>Total Admission</h5>
                         </div>

                         <div className="card2">
                             <h1>250+</h1>
                             <h5>Girls</h5>
                         </div>

                         <div className="card3">
                             <h1>250+</h1>
                             <h5>Boys</h5>
                         </div>

                         {/* <div className="card4">
                             <h1>Boys</h1>
                             <p>250</p>
                         </div> */}
                     </div>
                  </div>
              </div>

          </div>
      </main>
  
  )
}

export default Board