import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        cardInfo={{
          title: "Total Users",
        }}
        type="users"
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        cardInfo={{
          title: "Total Sensors",
        }}
        type="sensors"
        className="center-card"
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        cardInfo={{
          title: "Today's Date",
        }}
        type="date"
      />
    </section>
  );
};

export default AreaCards;
