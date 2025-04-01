

import React, { useEffect } from "react";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import "./style.scss";

interface CustomAlertProps {
    text?: string;
    onClose: () => void;
    severity?: "success" | "error" | "warning" | "info";
}

const CustomAlert: React.FC<CustomAlertProps> = ({ text, onClose, severity = "success" }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); // Đóng sau 2 giây

        return () => clearTimeout(timer); // Xóa timer nếu component unmount
    }, [onClose]);

    return (
        <div className="custom_alert">
            <Alert icon={<CheckIcon fontSize="inherit" />} severity={severity} onClose={onClose} >
                {text}
            </Alert>
        </div>
    );
};

export default CustomAlert;
