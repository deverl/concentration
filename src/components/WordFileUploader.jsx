
import PropTypes from 'prop-types';

function WordFileUploader({ onWordsLoaded }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const words = contents
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
      onWordsLoaded(words);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Upload word list:</label>
      <input type="file" accept=".txt" onChange={handleFileChange} />
    </div>
  );
}


WordFileUploader.propTypes = {
  onWordsLoaded: PropTypes.func.isRequired,
};

export default WordFileUploader;

