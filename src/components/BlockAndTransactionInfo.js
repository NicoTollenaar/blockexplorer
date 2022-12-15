function BlockAndTransactionInfo({ formattedBlockAndAddressData }) {
  return (
      // <div className="mx-8 flex justify-start">
          <table className="ml-[80px] w-3/5 my-[40px] min-w-max table-auto">
          <tbody className="text-gray-600 text-sm font-light">
            {formattedBlockAndAddressData?.map((e, index) => {
              return (
                <tr
                  key={index}
                  className="mx-8 border-b border-gray-200"
                >
                  <td className="py-3 pr-6 text-left whitespace-nowrap">
                    <div className="flex items-left text-left">
                      <p className="text-left font-medium text-gray-700">
                        {e.key}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="hover:text-red-600 font-medium text-blue-600">
                        {JSON.stringify(e.value)}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      // </div>
  );
}

export default BlockAndTransactionInfo;
