import React, { useState, useEffect, Fragment } from "react";
import Plot from "react-plotly.js";
import { NavLink } from "react-router-dom";

const CoinSearch = () => {
	return (
		<>
			<Plot
				data={[
					{
						x: [1, 2, 3, 4],
						y: [10, 15, 13, 17],
						type: "scatter", // 차트 유형
						mode: "lines+markers", // 데이터 점과 라인 표시
						marker: { color: "red" }, // 마커 색상 설정
					},
				]}
				layout={{ width: 720, height: 440, title: "A Test Plot" }}
			/>
		</>
	);
};
export default CoinSearch;
