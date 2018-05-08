$(function () {
	var classifications = {
		"A1": "Urban major conurbation",
		"B1": "Urban minor conurbation",
		"C1": "Urban city and town",
		"C2": "Urban city and town in a sparse setting",
		"D1": "Rural town and fringe",
		"D2": "Rural town and fringe in a sparse setting",
		"E1": "Rural village",
		"E2": "Rural village in a sparse setting",
		"F1": "Rural hamlets and isolated dwellings",
		"F2": "Rural hamlets and isolated dwellings in a sparse setting"
	};
	var grades = ["A*", "A", "B", "C", "D", "E", "F"];
	Papa.parse('data/wales_lottery.csv', {
		download: true,
		header: true,
		complete: function (results, file) {
			$('#ploading').hide();
			$('#divapp').show();
			// And attach the event
			$('#btnsearch').click(function (e) {
				e.preventDefault();
				$('#divresults').hide();
				$('#diverror').hide();
				var search = $('#txtpostcode').val();
				var found = false;
				var classification = '';
				var grade = '';
				$.each(results.data, function (i, result) {
					if (search.toUpperCase().replace(/\s/g, '') == result.postcode.toUpperCase().replace(/\s/g, '')) {
						found = true;
						grade = result.grade;
						classification = classifications[result.urban_code];
						$('#hgrade').text('Grade ' + grades[grade - 1] + ' postcode');
						$('#pclassification').text(result.postcode + '. This postcode has been graded on distance to nearest library, relative to other areas of the same classification. ' + classification + '.');
					}
				});
				if (found) {
					$('#divresults').show();
				} else {
					$('#diverror').show();
				}
			});
		}
	})
});