import { Routes, Route } from "react-router-dom";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BlockAndTransactionInfo from "./components/BlockAndTransactionInfo";
import TransactionTable from "./components/TransactionTable";
import SearchBar from "./components/SearchBar.js";
import BlockPage from "./pages/BlockPage";
import TransactionPage from "./pages/TransactionPage";
import AddressPage from "./pages/AddressPage";
import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [formattedBlockAndAddressData, setFormattedBlockAndAddressData] =
    useState([]);
  const [selectedType, setSelectedType] = useState("Block");
  const [placeholder, setPlaceholder] = useState("Block Number");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [balance, setBalance] = useState(0);
  const [retrieve, setRetrieve] = useState(false);

  useEffect(() => {
    function handleBlockEvent(blockNo) {
      setBlockNumber(blockNo);
    }
    alchemy.ws.on("block", handleBlockEvent);

    return function cleanup() {
      alchemy.ws.off("block", handleBlockEvent);
    };
  }, []);

  function formatBlockAndAddressData(object) {
    const array = [];
    let value;
    for (let key in object) {
      if (key === "logsBloom" || key === "logs") {
        continue;
      } else if (key === "transactions") {
        value = object[`${key}`].length;
      } else if (ethers.BigNumber.isBigNumber(object[`${key}`])) {
        value = object[`${key}`].toNumber();
      } else {
        value = object[`${key}`];
      }
      array.push({
        key,
        value,
      });
    }
    return array;
  }

  function handleChangeSelection(e) {
    setSearchInput("");
    setSearchResult("");
    setSelectedType(e.target.value);
    switch (e.target.value) {
      case "Block":
        setPlaceholder("Block Number");
        break;
      case "Transaction":
        setPlaceholder("Tx Hash");
        break;
      case "Address":
        setPlaceholder("0x Address");
        break;
      default:
        alert("something went wrong in switch block");
    }
  }

  useEffect(() => {
    setFormattedBlockAndAddressData(formatBlockAndAddressData(searchResult));
  }, [searchResult]);

  async function handleSearch() {
    console.log("in handle search, logging selectedType:", selectedType);
    try {
      if (selectedType === "Block") {
        console.log(
          "now in if block of handle search, logging selectedType:",
          selectedType
        );
        const response = await alchemy.core.getBlock(Number(searchInput));
        setSearchResult(response);
      } else if (selectedType === "Transaction") {
        const response = await alchemy.core.getTransactionReceipt(searchInput);
        setSearchResult(response);
      } else if (selectedType === "Address") {
        const response = await getAddressInfo();
        setAddressData(response);
      } else {
        alert("something went wrong");
      }
    } catch (error) {
      alert(error);
    }
  }
  async function getAddressInfo() {
    try {
      if (selectedType === "Address" && searchInput) {
        const response = await alchemy.core.getBalance(searchInput, "latest");
        setBalance(ethers.utils.formatEther(response));
      }
      let totalTransactions = [];
      let blockTransactions = [];
      let currentBlock = blockNumber;
      let param = {};
      let addressTransactions = [];
      for (let i = currentBlock; i >= currentBlock - 20; i--) {
        param = { blockNumber: Utils.hexValue(i).toString() };
        blockTransactions = await alchemy.core.getTransactionReceipts(param);
        addressTransactions = blockTransactions.receipts.filter((e) => {
          console.log("searchInput:", searchInput);
          console.log("e.from:", e.from);
          if (parseInt(e.from, 16) === parseInt(searchInput, 16)) {
            console.log("MATCH!");
            console.log("blockNumber", blockNumber);
          }
          return parseInt(e.from, 16) === parseInt(searchInput, 16);
        });
        console.log("addressTransactions", addressTransactions);
        totalTransactions = totalTransactions.concat(addressTransactions);
      }
      console.log("totalTransactions:", totalTransactions);
      return totalTransactions;
    } catch (error) {
      alert(error);
    }
  }

  function changeSearchInput(input) {
    console.log("in change searchInput, logging input:", input);
    setSearchInput(input);
    return;
  }
  function changeSelectedType(type) {
    console.log("in change selected type, logging type:", type);
    setSelectedType(type);
    return;
  }
  function changeRetrieve(value) {
    console.log("in changeRetrieve, logging value:", value);
    setRetrieve(value);
    return;
  }

  useEffect(() => {
    console.log(
      "in useEffect handlesearch, logging selectedtype and searchInput:",
      selectedType,
      searchInput
    );
    if (retrieve) retrieveInfo();
    async function retrieveInfo() {
      await handleSearch();
      setRetrieve(false);
    }
  }, [retrieve]);

  console.log("In App.js logging selectedType:", selectedType);
  console.log("In App.js logging searchInput:", searchInput);

  return (
    <>
      <SearchBar
        blockNumber={blockNumber}
        handleSearch={handleSearch}
        selectedType={selectedType}
        handleChangeSelection={handleChangeSelection}
        placeholder={placeholder}
        searchInput={searchInput}
        changeSearchInput={changeSearchInput}
      />
      <Routes>
        <Route path="/block" element={<BlockPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/address" element={<AddressPage />} />
      </Routes>

      {selectedType === "Block" && (

        <BlockPage
          formattedBlockAndAddressData={formattedBlockAndAddressData}
        />
      )}

      {selectedType === "Transaction" && (
        <TransactionPage
          formattedBlockAndAddressData={formattedBlockAndAddressData}
        />
      )}
      
      {selectedType === "Address" && (
        <AddressPage
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
      )}
    </>
  );
}

export default App;
