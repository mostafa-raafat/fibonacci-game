import React, { Component } from 'react'
import './game.style.scss';

type gridSize = {
    rows: number,
    cols: number
}

type stateType = {
    gameGrid: any[][],
    selectedCell: {
        row: number | undefined,
        column: number | undefined
    },
    fibSequence: any
}

export default class GameComponent extends Component<gridSize, stateType> {

    private gameGrid: any[][] = [];
    private fibCacheList: any = {};
    private fibNumber: any = {
        2: true,
        3: true,
        5: true,
        8: true,
        13: true
    };
    private fibSequence: any = {};
    
    constructor(props: any) {
        super(props);
        for (let i = 0; i < this.props.rows; i++) {
            this.gameGrid[i] = new Array(this.props.cols).fill(null);
        }
        this.state = {
            gameGrid: this.gameGrid,
            selectedCell: {
                row: undefined,
                column: undefined
            },
            fibSequence: {}
        }
    }

    render() {
        return (
            <div className='grid'>
            {
                this.state.gameGrid.map((gameRow: any, rowIndex: any) => (
                    <div key={rowIndex} className="grid__row">
                    {
                        gameRow.map((gameCell: any, columnIndex: any) => (
                            <div 
                                key={rowIndex+'-'+columnIndex}
                                className={`grid__cell 
                                    ${
                                        this.state.selectedCell.row === rowIndex || 
                                        this.state.selectedCell.column === columnIndex ? 
                                        'cell-highlight' : ''
                                    }
                                    ${
                                        `${rowIndex}-${columnIndex}` in this.state.fibSequence ?
                                        'cell-highlight-green' : ''
                                    }`
                                }
                                onClick={this.cellClicked.bind(this, rowIndex, columnIndex)}
                            >
                                { gameCell ? gameCell : '' }
                            </div>
                        ))      
                    }
                    </div>
                ))
            }
            </div>
        )
    };

    public cellClicked(row: number, column: number): void {
        for (let i = 0; i < this.props.rows; i++) {
            this.gameGrid[i][column]++;
        }

        this.gameGrid[row][column]--

        for (let i = 0; i < this.props.cols; i++) {
            this.gameGrid[row][i]++;
            this.checkFibonacci(this.gameGrid[i], i);
        }

        this.setState({gameGrid: this.gameGrid, selectedCell: { row, column }, fibSequence: this.fibSequence });
        setTimeout(() => {
            if(Object.keys(this.fibSequence).length) {
                this.fibSequence = {};
            }
            this.setState({ selectedCell: { row: undefined, column: undefined}, fibSequence: {} });
        }, 500);
    }

    private checkFibonacci(row: Array<number>, rowNumber: number): void {
        for (let i = 0; i < row.length; i++) {
            let list: Set<number>;
            if((row[i] && row[i+1] && row[i+2] && row[i+3] && row[i+4]) !== null) {
                list = new Set([row[i], row[i+1], row[i+2], row[i+3], row[i+4]])
                if(
                    this.fibNumber[row[i]] && this.fibNumber[row[i+1]] && 
                    this.fibNumber[row[i+2]] && this.fibNumber[row[i+3]] &&
                    this.fibNumber[row[i+4]] && list.size === 5
                ) {
                    if(this.FibListMemo([row[i], row[i+1], row[i+2], row[i+3], row[i+4]])) {
                        this.gameGrid[rowNumber][i]   = 
                        this.gameGrid[rowNumber][i+1] = 
                        this.gameGrid[rowNumber][i+2] = 
                        this.gameGrid[rowNumber][i+3] =
                        this.gameGrid[rowNumber][i+4] = null;

                        this.fibSequence[`${rowNumber}-${i}`] =
                        this.fibSequence[`${rowNumber}-${i+1}`] =
                        this.fibSequence[`${rowNumber}-${i+2}`] =
                        this.fibSequence[`${rowNumber}-${i+3}`] =
                        this.fibSequence[`${rowNumber}-${i+4}`] = true;
                    }
                }
            }
        }
    }

    private isFib(val: number): boolean {
        var check1 = 5 * Math.pow(val, 2) + 4;
        var check2 = 5 * Math.pow(val, 2) - 4;

        function isPerfectSquare(num: number) {
            return Math.sqrt(num) % 1 === 0;
        }

        // We see if the checks are perfect squares
        var isPerfect1 = isPerfectSquare(check1);
        var isPerfect2 = isPerfectSquare(check2);

        if (isPerfect1 && isPerfect2) {
            return true;
        }
        else return !!(isPerfect1 || isPerfect2);
    }

    private isFibSequence(arr: number[]): boolean {
        if (arr.length < 3) {
            return false;
        }

        let fib1 = 0;
        let fib2 = 1;

        while (fib1 < arr[0]) {
            let tmp = fib1 + fib2;
            fib1 = fib2;
            fib2 = tmp;
        }

        if (fib1 !== arr[0]) {
            return false;
        }

        if (fib2 !== arr[1]) {
            return false;
        }

        for (let i = 2; i < arr.length; i++){
            if (arr[i] < 0)
                return false;

            if (arr[i] !== (arr[i - 1] + arr[i - 2]))
                return false;
        }
        return true;
    }

    private FibListMemo(list: number[]): boolean {
        let isFibSequence: boolean;
        let FibListKey: string = list.toString();
        if (FibListKey in this.fibCacheList)
            isFibSequence = this.fibCacheList[FibListKey];
        else
            isFibSequence = this.fibCacheList[FibListKey] = this.isFibSequence(list);
        return isFibSequence;
    }
}
