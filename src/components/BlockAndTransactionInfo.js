function BlockAndTransactionInfo({ formattedBlockAndAddressData }) {
  return (
    <>
      <div>
        <ul className="m-5">
          {formattedBlockAndAddressData?.map((e, index) => {
            return (
              <li key={index} className="ml-5 first-letter:flex justify-start">
                <div className="ml-5 w-40 inline-block">
                  <b>{e.key}:</b>
                </div>
                <div className="inline-block">{JSON.stringify(e.value)}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}


export default BlockAndTransactionInfo;