import React from 'react';

function filterResults(results: any) {
    const filteredResults = [];
    for (var i = 0; i < results.length; ++i) {
        if (i === 0) {
            filteredResults.push(results[i]);
            continue;
        }

        if (results[i].decodedText !== results[i - 1].decodedText) {
            filteredResults.push(results[i]);
        }
    }
    return filteredResults;
}

const ResultContainerTable = ({ data }: any) => {
    const results = filterResults(data);
    return (
        <table className={'Qrcode-result-table'}>
            <thead>
                <tr>
                    <td>#</td>
                    <td>Decoded Text</td>
                    <td>Format</td>
                </tr>
            </thead>
            <tbody>
                {
                    results.map((result, i) => {
                        console.log(result);
                        return (<tr key={i}>
                            <td>{i}</td>
                            <td>{result.decodedText}</td>
                            <td>{result.result.format.formatName}</td>
                        </tr>);
                    })
                }
            </tbody>
        </table>
    );
};

const ResultContainerPlugin = (props: any) => {
    const results = filterResults(props.results);

    console.log('results', results[0].decodedText);
    
    // return (
    //     <div className='Result-container'>
    //         <div className='Result-header'>Scanned results ({results.length})</div>
    //         <div className='Result-section'>
    //             <ResultContainerTable data={results} />
    //         </div>
    //     </div>
    // );
};

export default ResultContainerPlugin;
