function BlockAndTransactionInfo({ formattedBlockAndAddressData }) {
  return (
      // <div className="mx-8 flex justify-start">
          <table className="w-3/5 my-[40px] min-w-max table-auto">
          <tbody className="text-gray-600 text-sm font-light">
            {formattedBlockAndAddressData?.map((e, index) => {
              return (
                <tr
                  key={index}
                  className="mx-8 border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <p className="hover:text-red-600 font-medium text-gray-700">
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
