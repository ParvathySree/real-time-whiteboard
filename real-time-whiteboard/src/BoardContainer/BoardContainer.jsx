import WhiteBoard from '../WhiteBoard/WhiteBoard'
import './BoardContainer.css'

export const BoardContainer = () => {

 return(
    <>
    <div className='outer-con'>
        <h1 className='title'>CollaBoard.</h1>
        <div className='whiteboard-con'>
        <WhiteBoard/>
        </div>
        {/* <span> Real-Time Collaboration, Unbounded Creativity.</span> */}
    </div>
    </>
 )
}

