import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button';


export default function Home() {
  const navigate = useNavigate();
  return (
    <>
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img src="/chessboard.jpg" alt="chessboard" className='max-w-96' />
          </div>
          <div className="pt-16">
            <div className="flex justify-center">

            <h2 className='text-4xl font-bold text-white'>Heyyy chennel welcome to my guyss</h2>
            </div>
            <div className="mt-8 flex justify-center">
            <Button onClick={()=>{navigate("./game")}}>
              Play
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
