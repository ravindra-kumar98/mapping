import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [mapping, setMapping] = useState({});
  const [mappedData, setMappedData] = useState([]);

  const dbColumns = [
    "emp_id",
    "full_name",
    "email_id",
    "role",
    "team",
    "join_date",
  ];
  useEffect(() => {
    const fetchData = async () => {
      const req = await fetch("/employee.json");
      const resp = await req.json();
      setData(resp);
    };
    fetchData();
  }, []);

  const jsonKeys = data.length > 0 ? Object.keys(data[0]) : [];

  const preparePayload = () => {
    return data.map((employee) => {
      const row = {};
      Object.keys(mapping).forEach((jsonKey) => {
        const dbColumn = mapping[jsonKey];
        if (dbColumn) {
          row[dbColumn] = employee[jsonKey];
        }
      });
      return row;
    });
  };

  const submitData = async () => {
    const payload = preparePayload();
    setMappedData(payload);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log(result);
      alert("Data saved in database!");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-10 px-5 flex-col">
      <div className="bg-slate-800 p-4 w-100 rounded-lg">
        <h1 className="text-2xl text-slate-300 font-bold mb-4">
          JSON to DB Mapping
        </h1>

        {jsonKeys.map((key) => (
          <div key={key} className="mb-3">
            <strong className="mb-1 block">{key}:</strong>
            <select
              value={mapping[key] || ""}
              onChange={(e) =>
                setMapping({ ...mapping, [key]: e.target.value })
              }
              className="border-1 rounded-sm p-2 text-xs w-full"
            >
              <option value="">Select DB Column</option>
              {dbColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={submitData}
          className="border-1 border-amber-600 text-amber-600 text-sm py-2 px-3 rounded-sm mt-4 block w-full hover:bg-amber-600 hover:text-white cursor-pointer font-semibold transition-all ease-in duration-150"
        >
          Submit
        </button>
      </div>
      {mappedData.length > 0 && (
        <div className="mt-6 bg-slate-700 p-4 rounded-lg text-slate-200">
          <h2 className="text-xl font-semibold mb-3">Mapped Data Table</h2>

          <div className="overflow-auto">
            <table className="min-w-full border border-slate-600">
              <thead className="bg-slate-800">
                <tr>
                  {Object.keys(mappedData[0]).map((col) => (
                    <th
                      key={col}
                      className="border border-slate-600 px-3 py-2 text-left text-sm"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {mappedData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-600">
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="border border-slate-600 px-3 py-2 text-sm"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
