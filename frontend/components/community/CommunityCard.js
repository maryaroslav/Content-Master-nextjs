import Image from 'next/image';

const CommunityCard = ({ bg, svg, color }) => {
  return (
    <div className='card' style={{ backgroundColor: bg }}>
      <Image src={svg} alt="icon" style={{ filter: "none", fill: color }}/>s
    </div>
  );
};

export default CommunityCard;