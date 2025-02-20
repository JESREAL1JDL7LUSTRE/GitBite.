import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavbarMenu = () => {
  const nav = useNavigate()
  return (
    <li>
        <div>
          <button onClick={() => {
            nav("/profile")
          }}> profile </button>
        </div>
        <div>
          <button onClick={() => {
            nav("/order")
          }}> Previous order </button>
        </div>
        <div>
          <button onClick={() => {
            nav("/payment")
          }}> Previous Payment </button>
        </div>
        <div>
          <button onClick={() => {
            nav("/cart")
          }}> cart </button>
        </div>
  
    </li>
  )
}

export default NavbarMenu
