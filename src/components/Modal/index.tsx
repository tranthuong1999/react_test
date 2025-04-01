import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames";
// import './style.scss';
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding : "16px 32px",
    // minHeight: 400,
    outline: 0,
    border: null,
    borderRadius: 1,
    backgroundColor: " #fff",
    // height: "40vh",
    // width: "80vh",
    zIndex: 1
};

export default function BasicModal(props: { open: boolean, onClose?: () => void, width?: string, content?: any }) {
    const { open, onClose, width, content } = props;
    const theme = useTheme();
    const isTabnet = useMediaQuery(theme.breakpoints.between(600, 1024));
    const isMobile = useMediaQuery(theme.breakpoints.down(600));
    const isComputer = useMediaQuery(theme.breakpoints.up(1024));
    return (
        <Modal
            open={open}
            onClose={onClose}
            className='moadal-basic-common'
        >
            <div
                className={classNames('box', isTabnet ? "box-tabnet" : "", isMobile ? "box-mobile" : "")}
            >
                <Box sx={style}>
                    {content}
                </Box>
            </div>
        </Modal>
    );
}