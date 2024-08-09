import EnquiriesRequested from "./EnquiriesRequested";
import UserLocationsMap from "./UserLocationsMap";
import Notifications from "./Notifications";
import CreateUser from "./CreateUser";
import "./AreaCharts.scss";

const AreaCharts = () => {
  return (
    <section className="content-area-charts">
      <EnquiriesRequested />
      <UserLocationsMap />
      <Notifications />
      <CreateUser />
    </section>
  );
};

export default AreaCharts;
