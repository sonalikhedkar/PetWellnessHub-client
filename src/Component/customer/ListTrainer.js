import React, { useState } from "react";
import "./home.css";
import { Component } from "react";
import ApiService from "../../service/ApiService";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

class ListAllTrainers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hostels: [],
      message: "",
      role: "",
    };
  }

  componentDidMount() {
    ApiService.fetchTrainers().then((resp) => {
      this.setState({ hostels: resp.data });
      console.log(this.state.hostels);
    });

    
    let loginData = localStorage.getItem("loginDetails")
      ? localStorage.getItem("loginDetails")
      : null;
    if (loginData) {
      loginData = JSON.parse(loginData);
      this.setState({ role: loginData.role });
    }

    setTimeout(() => {
      const reloadCount = sessionStorage.getItem("reloadCount");
      if (reloadCount < 1) {
        sessionStorage.setItem("reloadCount", String(reloadCount + 1));
        window.location.reload();
      } else {
        sessionStorage.removeItem("reloadCount");
      }
    }, 800);
  }

  addtocart = (p1) => {
    let loginData = localStorage.getItem("loginDetails")
      ? localStorage.getItem("loginDetails")
      : null;

    if (loginData) {
      loginData = JSON.parse(loginData);
      if (loginData.id) {
        let cartData = { customerId: loginData.id, productId: p1.id };
        ApiService.addtoCardAPI(cartData)
          .then((resp) => {
            this.setState({ message: "Item Added to Cart !!!" });
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your appointmnet has been  successfully booked...",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.resp.data.message,
              footer: '<a href="">Why do I have this issue?</a>',
            });
          });
      }
    } else {
      alert("please login");
      window.location.href = "/login";
    }
  };

  render() {
    return (
      <>
        <h1><i>Trainers</i></h1>
        <div className="d-flex flex-wrap  justify-content-center align-items-center mt-4">
          {this.state.hostels.map((p1) => (
            <div
              className="container m-2"
              key={p1.id}
              style={{ width: "25rem" }}
            >
              <div
                className="card mb-3 p-2 "
                style={{
                  height: "25rem",
                  boxShadow:
                    " 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.404)",
                }}
              >
              
                <div className="card-body">
                  <h5 className="card-tiltle"><b>{p1.firstName} {p1.lastName}</b></h5>
                  <p className="card-text"> Fees: Rs.{p1.fees}/-</p>
                  <p className="card-text"> Experience: {p1.experience}YEAR</p>
                  <p className="card-text"> Email: {p1.email}</p>
                  <p className="card-text"> Contact: {p1.mobileNum}</p>
                  <p className="card-text"> Address: {p1.address}</p>
                  
                  <div className="col-6"></div>
                  
                  <hr />

                  <div className="row d-flex justify-content-around ">
                    {this.state.role == "admin" ? (
                      <></>
                    ) : (
                      <div className="col-5" style={{ width: "50%" }}>
                        <button
                          className="  btn btn-primary w-100"
                          onClick={() => this.addtocart(p1)}
                        >
                          Book an Appointment
                        </button>
                      </div>
                    )}
                    {/* <div className="col-5" style={{ width: "50%" }}>
                      <Link
                        className="btn  btn-primary w-100 "
                        to={{
                          pathname: "/hosteldetails",
                          state: { proId: p1.id },
                        }}
                      >
                        View hostel details
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </>
    );
  }
}
export default ListAllTrainers;


