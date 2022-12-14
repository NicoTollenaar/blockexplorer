import { useEffect, useState } from "react";

function TransactionTable({
  selectedType,
  searchInput,
  addressData,
  changeSelectedType,
  changeSearchInput,
  retrieve,
  changeRetrieve,
  handleSearch,
  balance,
}) {
  // useEffect(() => {
  //   console.log(
  //     "in useEffect handlesearch, logging selectedType:",
  //     selectedType
  //   );
  //   handleSearch();
  // }, [selectedType, searchInput]);

  function handleClick(event, parameters) {
    console.log("in handleclick, logging paramters:", parameters);
    changeSearchInput(parameters.input);
    console.log(
      "I'm back in handleclick, after changesearchinput, before change selectin"
    );
    changeSelectedType(parameters.type);
    console.log("Still in handleclick, now after change selectedType");
    changeRetrieve(true);
  }

  console.log("selectedType", selectedType);
  console.log("searchInput", searchInput);

  return (
    <>
      <h5 className="m-5 font-bold text-gray-700">ETH Balance: {balance}</h5>
      <h5 className="m-5 font-bold text-gray-700">
        Transactions in the last 10 blocks: {addressData?.length || 0}
      </h5>

      <div className="m-5 overflow-x-auto">
        <div className="my-5 w-full lg:w-5/6">
          <div className="my-5 bg-white shadow-md rounded">
            <table className="my-[20px] min-w-max w-full table-auto">
              <thead className="my-8">
                <tr className="my-8 bg-gray-100 text-sm text-gray-500 font-thin">
                  <th className="py-3 px-6 text-left">Tx Hash</th>
                  <th className="py-3 px-6 text-left">To</th>
                  <th className="py-3 px-6 text-left">Block Number</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {addressData?.map((e, index) => {
                  return (
                    <tr
                      key={index}
                      className="my-8 border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <p
                            onClick={(event) =>
                              handleClick(event, {
                                type: "Transaction",
                                input: e.transactionHash,
                              })
                            }
                            className="hover:text-red-600 font-medium text-blue-600"
                          >
                            {e.transactionHash}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <p
                            onClick={(event) =>
                              handleClick(event, {
                                type: "Address",
                                input: e.to,
                              })
                            }
                            className="hover:text-red-600 font-medium text-blue-600"
                          >
                            {e.to}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            onClick={(event) =>
                              handleClick(event, {
                                type: "Block",
                                input: parseInt(e.blockNumber, 16),
                              })
                            }
                            className="hover:text-red-600 font-medium text-blue-600"
                          >
                            {parseInt(e.blockNumber, 16)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionTable;
