import React from "react";
import "./tableWidget.css";

const TableWidget = ({ columns, data, actions, title }) => {
  return (
    <div className="user-table-container">
      <h2 className="event-title">{title}</h2>
      <table className="user-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.headerName}</th>
            ))}
            {actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col) => (
                <td key={col.field}>
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </td>
              ))}
              {actions && (
                <td className="actions">
                  {actions.map((action, i) => (
                    <button key={i} onClick={() => action.onClick(row)}>
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidget;
