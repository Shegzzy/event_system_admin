import "./widgetLg.css";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Attendees Signing Up</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Name</th>
          <th className="widgetLgTh">Event</th>
          <th className="widgetLgTh">Date</th>
          {/* <th className="widgetLgTh">Status</th> */}
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <span className="widgetLgName">Susan Carol</span>
          </td>
          <td className="widgetLgDate">Wedding</td>
          <td className="widgetLgAmount">2 Jun 2021</td>
        </tr>
      </table>
    </div>
  );
}
