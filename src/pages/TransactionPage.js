import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import BlockAndTransactionInfo from "../components/BlockAndTransactionInfo";

function TransactionPage({ formattedBlockAndAddressData }) {
  return (
    <>
      <BlockAndTransactionInfo
        formattedBlockAndAddressData={formattedBlockAndAddressData}
      />
    </>
  );
}

export default TransactionPage;
