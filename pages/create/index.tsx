import React, { useState } from "react";
import { CreateForm } from "@/pages/Create";
import { CreateFormInput } from "@/components/pages/Create/CreateFormPage";
import ConnectWalletPage from "@/components/pages/UserProfile/ConnectWalletPage";
import useContract from "hooks/useContract";
import { AfenNft } from "contracts/types";
import useUser from "hooks/useUser";
import { AFEN_NFT_ABI } from "contracts/abis/AfenNFT";
import { BigNumber } from "ethers";
import { api } from "utils/api";

export interface CreateFormResponse {
  title?: string;
  text: string;
  status?: "error" | "success" | "info";
}

export default function Create() {
  const { contractSigned, setAbi } = useContract();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<CreateFormResponse | null>(null);

  setAbi(AFEN_NFT_ABI);

  const createNFT = async (data: CreateFormInput) => {
    setLoading(true);
    const nftContract = contractSigned as AfenNft;

    let formData = new FormData();
    formData.append("file", data.upload);
    formData.append("title", data.title);
    formData.append("royalty", data.royalty.toString());
    formData.append("description", data.description);
    formData.append("price", data.afenPrice.toString());
    formData.append("userId", user.user._id);

    try {
      const response = await api.post("/nft/create/", formData, {
        headers: {
          "Content-type": "multipart/form-data",
          type: "formData",
        },
      });

      if (response.status === 200) {
        setMessage({
          text: "Art Saved",
          status: "success",
        });

        const priceA = BigNumber.from(data.afenPrice);
        const priceB = BigNumber.from(data.bnbPrice);

        const value = await nftContract.create_nft(
          response.data.nft.fileHash,
          priceA,
          priceB
        );

        if (value.hash) {
          setMessage({
            text: "Congratulation, NFT created.",
            status: "success",
          });
        }

        console.log(value);
      }
    } catch (e) {
      setMessage({
        status: "error",
        text: "An error occured while trying to create NFT, please again later",
      });
      console.log(e);
    }
    setLoading(false);
  };

  return user.address ? (
    <CreateForm
      onSubmit={createNFT}
      user={user.user}
      wallet={user.address}
      loading={loading}
      message={message}
    />
  ) : (
    <ConnectWalletPage />
  );
}
