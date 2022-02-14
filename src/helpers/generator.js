const shuffle = require("shuffle-array");

export function generate_arrays(participants, pyParticipants, restrictions) {
    // participants will be a array of participant objects from JSON server
    // pyParticipants will be a array of participant objects from JSON server
    // restrictions will be a array of restriction objects from JSON server

    // generate an array of names of participants
    const part_names = participants.map((participant) => participant.name);
    const part_ids = participants.map((participant) => participant.id);

    // generate an array of arrays of each respective participant's py draw
    const py_arrs = [];
    part_names.forEach(() => py_arrs.push([]));
    pyParticipants.forEach((pyParticipant) => {
        const part_index = part_names.indexOf(pyParticipant.name);

        // if participant in py draw and they had a secretDraw, add to array
        if (part_index >= 0) {
            if (pyParticipant.secretDraw) {
                py_arrs[part_index].push(pyParticipant.secretDraw);
            }
        }
    });

    // generate an array of arrays of each respective participant's restrictions
    const rest_arrs = [];
    part_names.forEach(() => rest_arrs.push([]));

    restrictions.forEach((restriction) => {
        const part_index = part_ids.indexOf(restriction.participantId);
        if (part_index >= 0) {
            rest_arrs[part_index].push(restriction.name);
        }
    });

    // generate an array of arrays of each respective participants valid draws
    const valid_draws = [];
    part_names.forEach((cur_part_name, i) => {
        const new_valid_draws = [];

        part_names.forEach((pos_draw_name) => {
            if (cur_part_name !== pos_draw_name) {
                if (
                    !py_arrs[i].includes(pos_draw_name) &&
                    !rest_arrs[i].includes(pos_draw_name)
                ) {
                    new_valid_draws.push(pos_draw_name);
                }
            }
        });

        valid_draws.push(new_valid_draws);
    });

    return { part_names, part_ids, valid_draws };
}

export function generate_secret_draw(
    { part_names, part_ids, valid_draws },
    attempts
) {
    const start_indices = [];
    part_names.forEach((e, i) => start_indices.push(i));

    const end_indices = [...start_indices];
    const result_obj = { cleanDraw: true, draw: [], attempts: 0 };

    // Attempt 'i' times to find a clean drawing
    for (let i = 1; i <= attempts; i++) {
        // set clean draw to true and shuffle
        result_obj.cleanDraw = true;
        result_obj.draw = [];
        shuffle(end_indices);

        // if any drawings are not clean, set clean draw to false
        for (let j = 0; j < start_indices.length; j++) {
            const firstName = part_names[j];
            const drawName = part_names[end_indices[j]];

            result_obj.draw.push({
                name: firstName,
                id: part_ids[j],
                secretDraw: drawName,
            });

            // make sure draw name is in valid_draws for respective participant
            if (!valid_draws[j].includes(drawName)) {
                result_obj.cleanDraw = false;
            }
        }

        result_obj.attempts = result_obj.attempts + 1;

        // if after we generate a random draw, it is fully clean, break out
        if (result_obj.cleanDraw) {
            break;
        }
    }

    return result_obj;
}
