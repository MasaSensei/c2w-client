const TableDetails = ({
  headers,
  rows,
  title,
}: {
  headers: string[];
  rows: string[][];
  title: string;
}) => {
  return (
    <tr>
      <td colSpan={7} className="p-4 border-b">
        <div className="border bg-[#F6F7F9] p-4 rounded">
          <h4 className="text-sm font-semibold text-dark">{title}</h4>
          <div className="w-fit min-w-[500px] mt-4 border border-gray-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse rounded-lg bg-white overflow-hidden">
              <thead className="border-b bg-[#F6F7F9] text-[#758090]">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="py-2 px-4 font-normal"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableDetails;
