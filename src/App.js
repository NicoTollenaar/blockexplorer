import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BlockAndTransactionInfo from "./components/BlockAndTransactionInfo";
import TransactionTable from "./components/TransactionTable";
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
      <div>
        <div className="text-center m-8 text-2xl font-bold">
          Latest block: {blockNumber}
        </div>
      </div>

      <div className="w-full mx-5 flex justify-center">
        <div className="w-full mb-3">
          <div className="w-5/6 input-group relative flex mb-4">
            <select
              className="mr-2 form-control relative  px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              value={selectedType}
              onChange={handleChangeSelection}
            >
              <option value="Block">Block</option>
              <option value="Transaction">Transaction</option>
              <option value="Address">Address</option>
            </select>

            <input
              type="search"
              className="w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder={placeholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
              type="button"
              onClick={handleSearch}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                className="w-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {selectedType === "Block" || selectedType === "Transaction" ? (
        <BlockAndTransactionInfo
          formattedBlockAndAddressData={formattedBlockAndAddressData}
        />
      ) : (
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
      )}
    </>
  );
}

export default App;
