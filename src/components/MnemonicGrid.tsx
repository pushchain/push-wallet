export const MnemonicGrid: React.FC<{
  words: string[]
  disabled: boolean
  handleMnemonicChange?: (index: number, value: string) => void
}> = ({ words, disabled, handleMnemonicChange }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {words.map((word, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-lg font-medium">{`${index + 1}.`}</span>
          <input
            type="text"
            value={word}
            onChange={(e) => handleMnemonicChange(index, e.target.value)}
            placeholder={`Word ${index + 1}`}
            className="border p-2 rounded w-full text-center"
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  )
}
