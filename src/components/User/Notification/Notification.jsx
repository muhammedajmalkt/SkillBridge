import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../../../Lib/Socket'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../../api/axiosInstance'
import Loader from '../Layout/Loader'


const Notification = () => {
    const {user}=useSelector((state)=>state.auth )

    const [notification,setNotification] = useState([])
    
    useEffect(() => {
     if (!user?._id) return;
     socket.connect();

    socket.emit("user_connected", user._id);

    socket.on("received_message", (data) => {
      console.log(" New Notification:", data);
      setNotification((prev) => [data, ...prev]);
    });
    return () => {
      socket.off("received_message");
    };
  }, [user?._id, socket]);


  const { data,isPending ,isLoading} = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/getNotification")
      setNotification(data.data)
      return data.data
    },
    enabled :!! user?._id
  })
  // console.log(data);
   if(isLoading) return <div className='h-screen flex justify-center items-center '><Loader /></div>

  return (
    <div className=' h-screen '>
      <h1 className='text-2xl border-b-2 pt-5 pb-4 pl-10 font-medium mt-9'>Notifications</h1>
      
      {notification.length > 0 ? notification.map((item)=>(
        <div className='p-5 border-b '>
          <div className='flex gap-8 '>
            <img src={item?.sender.image} alt="" className='w-10 h-10 rounded-full ml-8 object-cover' />
            <div>
              <h1 className='  text-'>{item?.message} from <span className='font-medium'> {item?.sender.name}</span></h1>
              <h1 className='text-xs'>
                {item?.timestamp && new Date(item.timestamp).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </h1>
            </div>
          </div>


        </div>
      )): <div className='flex justify-center'> <h1>No notification found</h1></div>}
    
</div>
  )
}

export default Notification