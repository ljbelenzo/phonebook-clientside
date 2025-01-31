import React,{useRef, useState, useEffect} from 'react';

import Button from './Button';
import './ImageUpload.css';

const serverHost = "https://phonebook-serverside-production.up.railway.app";

const ImageUpload = props => {
    const {id:propsId, center:propsCenter, errorText, initialValue, readOnly} = props;
    const [file,setFile]=useState(undefined);
    const [previewUrl,setPreviewUrl]=useState(undefined);
    const [isValid,setIsValid]=useState(undefined);

    const filePickerRef = useRef();

    useEffect(()=>{
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    },[file]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
        pickedFile = event.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
       } else {
        setIsValid(false);
        fileIsValid = false;
       }
       props.onInput(propsId,pickedFile,fileIsValid);
    };

    return (
        <div className='form-control'>
            <input
                id={propsId}
                ref={filePickerRef}
                style={{display:'none'}}
                type='file'
                accept='.jpg,.png,.jpeg'
                onChange={pickedHandler}
            />
            <div className={`image-upload ${propsCenter && 'center'}`}>
                <div className='image-upload__preview'>
                   {previewUrl &&  <img src={previewUrl} alt="Preview" />}
                   {!previewUrl && !initialValue && <img src="https://placehold.co/600x400?text=Image+View&font=OpenSans" alt="Preview" />}
                   {!previewUrl && initialValue && <img src={`${serverHost}/${initialValue}`} alt="Preview" />}
                </div>

                {!readOnly && <Button type="button" size="small" onClick={pickImageHandler}>Select Image</Button>}
            </div>

            {isValid === false && <p>{errorText}</p>}
        </div>        
    );
};

export default ImageUpload;