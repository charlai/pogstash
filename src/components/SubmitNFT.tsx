import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextInput } from './shared/Input';
import { ZapContractActions } from 'l1-zap-contracts'
import {
  hexlify,
  hexZeroPad,
} from "ethers/lib/utils"

const Upload = styled.button`
    background-color: #b9a3e3;
    color: white;
    border-radius: 5px;
    border: none;
    padding: 10px 0px;
    width: 250px;
    margin-bottom: 20px;
`

const NFTUploadContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 350px;
    height: 350px;
    border-radius: 10px;
    box-shadow: rgb(0 0 0 / 10%) 1px 1px 4px;
`

const ImagePreview = styled.image`

`

const MetaContainer = styled.form`
    display: flex;
    flex-direction: column;
    width: 550px;
    height: 350px;
    border-radius: 10px;
    padding: 24px 36px;
    margin: 50px 16px;
    background: #FFFFFF;
    box-shadow: rgb(0 0 0 / 10%) 1px 1px 4px;
`

const MetaHeader = styled.h2`
    margin-bottom: 60px;
`

const TitleInput = styled(TextInput)`
    margin-bottom: 20px;`

const DescriptionInput = styled(TextInput)`
    margin-bottom: 50px;`

const Submit = styled.button`
    background-color: #6441a5;
    color: white;
    border-radius: 5px;
    border: none;
    padding: 10px 0px;
`

const exampleIpfsHash =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789fedcba"
const MAX_POSSIBLE_SERIES_TOTAL = 4294967295
const getRandomSerialNumber = () => Math.floor(Math.random() * MAX_POSSIBLE_SERIES_TOTAL)
const getRandomSerialNumberBytes4 = () => hexZeroPad(hexlify(getRandomSerialNumber()), 4)
const maxSeriesTotalBytes4 = hexZeroPad(hexlify(MAX_POSSIBLE_SERIES_TOTAL), 4)

export const SubmitNFT = (props) => {
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    // const [walletAccessAllowed, setWalletAccessAllowed] = useState();/ TODO: Should have error if requesting wallet
    const [zapContract, setZapContract] = useState(null);

    useEffect(async () => {
        if (zapContract == null) {
            console.log("requestingWalletAccess!")
            const walletAccess = await ZapContractActions.requestWalletAccess(window)
            setZapContract(walletAccess.zapContract)
            setLoading(false)
        }
    }, []);

    const hiddenFileInput = useRef(null);

    const handleClick = e => {
        hiddenFileInput.current.click();
    };
    const handleImageUpload = e => {
        setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0]
        });
    };

    const handleDescriptionChange = e => {
        setDescription(e.target.value)
    };

    const handleTitleChange = e => {
        setTitle(e.target.value)
    };

    const handleSubmit = e => {
        ZapContractActions.mintByOwnerForOwner(zapContract, exampleIpfsHash, maxSeriesTotalBytes4, getRandomSerialNumberBytes4())
        e.preventDefault();
    }

    return (
        <React.Fragment>
            <NFTUploadContainer>
                <ImageContainer>
                    {
                        image.preview ? <img src={image.preview} /> : null
                    }
                </ImageContainer>
                <MetaContainer onSubmit={handleSubmit}>
                    <MetaHeader> Upload an NFT </MetaHeader>
                    <Upload onClick={handleClick}>
                        + Upload an NFT
                    </Upload>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleImageUpload}
                        style={{display: 'none'}}
                        accept="image/png, image/jpeg"
                    />
                    <TitleInput
                        placeholder="Title"
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <DescriptionInput
                        placeholder="Description"
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <Submit type="submit"> Mint NFT </Submit>
                </MetaContainer>
            </NFTUploadContainer>
        </React.Fragment>
    )
}

export default SubmitNFT
