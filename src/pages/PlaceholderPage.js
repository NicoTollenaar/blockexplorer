import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import TransactionTable from "../components/TransactionTable";

function placeholder({
  addressData,
  selectedType,
  changeSelectedType,
  searchInput,
  changeSearchInput,
  handleSearch,
  balance,
  retrieve,
  changeRetrieve,
}) {
  return (
    <>
      <TransactionTable
        addressData={addressData}
        selectedType={selectedType}
        changeSelectedType={changeSelectedType}
        searchInput={searchInput}
        changeSearchInput={changeSearchInput}
        handleSearch={handleSearch}
        balance={balance}
        retrieve={retrieve}
        changeRetrieve={changeRetrieve}
      />
    </>
  );
}

export default placeholder;
