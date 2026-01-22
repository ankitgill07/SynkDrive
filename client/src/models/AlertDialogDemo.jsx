
import React, { useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FolderPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createFolderApi } from '@/api/FolderApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';



export default function DraggableDialog({ Allfolder }) {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset, setFocus } = useForm({
    defaultValues: {
      folderName: "",
    },
  })
  const { id } = useParams()



  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setFocus("folderName");
      }, 0);
    }
  }, [open]);



  const submitForm = async (data) => {
    const result = await createFolderApi(id, data)
    if (result.success) {
      setOpen(false)
      Allfolder()
      reset({ folderName: "" })
      toast.success(result.success)
    } else {

    }
  }

  return (
    <React.Fragment>
      <button variant="outlined" onClick={() => setOpen(true)} className=' bg-[#d9d4cc3b] hover:bg-[#e9e8e8] cursor-pointer px-2.5  py-1.5 flex items-center rounded-md  '>
        <FolderPlus size={19} />
        <span className=' font-plusjakartaSans ml-1.5  font-bold text-sm '>New folder</span>
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="draggable-dialog-title"
        style={{ borderRadius: "30px" }}
      >
        <form onSubmit={handleSubmit(submitForm)} >
          <DialogTitle style={{ width: "400px", padding: "20px", paddingBottom: "3px" }} id="draggable-dialog-title">
            <h2 className=' font-inter font-normal    text-2xl   '>New folder</h2>
          </DialogTitle>
          <DialogContent style={{ paddingLeft: "20px", paddingRight: "20px" }} >
            <DialogContentText style={{ marginTop: "10px" }}>

              <input
                {...register("folderName", { required: true })}
                name='folderName'
                type="text"
                className="
    w-full
 rounded-md 
    border border-gray-600
    bg-white
    px-3
    py-2.5
font-inter
    text-gray-900
    placeholder:text-gray-500
    transition
    duration-150
    ease-in-out

    focus:outline-none
    focus-visible:border-[#155DFC]
    focus-visible:ring-2
    focus-visible:ring-[#155DFC]/80

    disabled:bg-gray-500
    disabled:text-gray-400
    disabled:cursor-not-allowed
  "

                placeholder="Folder name"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: "20px", paddingTop: "14px" }} >
            <button onClick={() => {
              reset({ folderName: "" })
              setOpen(false)
            }} type="button" className=' bg-[#d9d4cc3b] px-4.5  hover:bg-[#e9e8e8] py-1.5  rounded-md cursor-pointer text-black font-inter font-medium ' >
              Cancel
            </button>
            <button type='submit' className=' bg-[#155dfc] px-4.5  py-1.5  rounded-md cursor-pointer text-white font-inter font-medium ' >
              Create
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

