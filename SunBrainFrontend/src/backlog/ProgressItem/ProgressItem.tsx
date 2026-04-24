import './progressItem.css';

const ProgressItem = () => {
  return (
    <>
      <div className="item">
        <div className="item_subject">Математика</div>
        <div className="item__progress--container">
          <div className="item__progress"></div>
        </div>
      </div>
    </>
  );
};

export default ProgressItem;
