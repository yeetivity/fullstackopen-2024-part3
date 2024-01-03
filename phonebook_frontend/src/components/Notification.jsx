import { useEffect } from "react"

const Notification = ({ msg, msgStyle, clearNotification }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            clearNotification()
        }, 3000);  // Clear notification after 3000 ms

        // Cleanup the timeout when the component unmounts or when the msg changes
        return () => clearTimeout(timeout)
    }, [msg, clearNotification])
    
    if (msg === null) {
        return null
    }
    
    return (
        <div style={msgStyle}>
            {msg}
        </div>
    )
}

export default Notification