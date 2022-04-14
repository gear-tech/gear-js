import Card from '../card';

function Summary() {
  return (
    <div>
      <Card heading="Current price" text="100 Gear" />
      <Card
        heading="Description"
        text="Folks please call me Garfunkel Sweetway. No one actually knows my real name, they just know how obtuse I
      am. Some people think I look like Diane Keaton, what do you think? I eat in my sleep, I hope that's
      not going to be a problem."
      />
      <Card heading="Royalty" text="15%" />
      <Card heading="Owner" text="Alice" />
    </div>
  );
}

export default Summary;
