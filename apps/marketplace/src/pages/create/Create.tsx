import { Input, Textarea } from '@gear-js/ui';

function Create() {
  return (
    <>
      <h2>Create</h2>
      <form>
        <Input label="Name" />
        <Textarea label="Description" />
        <input type="file" />
      </form>
    </>
  );
}

export default Create;
