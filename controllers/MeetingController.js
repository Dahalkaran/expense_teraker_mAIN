const Slot = require('../models/Slot');
const Meeting = require('../models/Meeting');
const { Op } = require('sequelize');

// Fetch available slots
exports.getSlots = async (req, res) => {
  const slots = await Slot.findAll({ where: { available: { [Op.gt]: 0 } } });
  res.json(slots);
};

// Fetch scheduled meetings
exports.getMeetings = async (req, res) => {
  const meetings = await Meeting.findAll({ include: Slot });
  res.json(meetings);
};

// Book a meeting and reduce the slot count
exports.bookMeeting = async (req, res) => {
  const { name, email, slotId } = req.body;

  const slot = await Slot.findByPk(slotId);
  if (slot && slot.available > 0) {
    await Meeting.create({ name, email, slot_id: slotId });
    slot.available -= 1;
    await slot.save();
    res.status(200).send('Meeting booked');
  } else {
    res.status(400).send('Slot not available');
  }
};

// Cancel a meeting and increase the slot count
exports.cancelMeeting = async (req, res) => {
  const meetingId = req.params.id;
  const meeting = await Meeting.findByPk(meetingId);

  if (meeting) {
    const slot = await Slot.findByPk(meeting.slot_id);
    slot.available += 1;
    await slot.save();
    await meeting.destroy();
    res.status(200).send('Meeting canceled');
  } else {
    res.status(400).send('Meeting not found');
  }
};