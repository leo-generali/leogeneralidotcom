const PROSE = {
  headings: 'prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-700',
  anchor: 'prose-a:text-red-400 hover:prose-a:text-red-500 prose-a:decoration-2 prose-a:underline-offset-2 prose-a:font-normal',
  code: 'prose-code:font-normal prose-code:text-base prose-code:text-slate-700 prose-code:bg-slate-200 prose-code:px-[0.15rem] prose-code:py-[0.2rem]'
}

module.exports = {
  prose: `prose prose-slate max-w-none ${PROSE.headings} ${PROSE.anchor} ${PROSE.code}`,
  link: `underline decoration-gray-500 text-gray-500 underline-offset-2 hover:decoration-gray-700 hover:text-gray-700`,
};
