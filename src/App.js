import { Header } from './Header'
import { Button } from './Button'
import { weekDays, weeklyWorkoutPlan, exerciseCategories } from './data'
import { useState, useEffect } from 'react'

export default function App() {
	const [plan, SetPlan] = useState(weeklyWorkoutPlan)
	const [currentDay, SetCurrentDay] = useState('Mon')
	const [formIsOpen, SetFormIsOpen] = useState(false)
	const [editingExercise, SetEditingExercise] = useState(null)

	const [exerciseName, SetExerciseName] = useState('')
	const [exerciseType, SetExerciseType] = useState('weights')
	const [exerciseSets, SetExerciseSets] = useState('')
	const [exerciseReps, SetExerciseReps] = useState('')
	const [exerciseRest, SetExerciseRest] = useState('')
	const [exerciseTargetWeight, SetExerciseTargetWeight] = useState('')
	const [exerciseCategory, SetExerciseCategory] = useState('core')
	const [exerciseTime, SetExerciseTime] = useState('')

	useEffect(() => {
		if (editingExercise) {
			SetExerciseName(editingExercise.name || '')
			SetExerciseType(editingExercise.type || 'weights')
			SetExerciseSets(editingExercise.sets || '')
			SetExerciseReps(editingExercise.reps || '')
			SetExerciseRest(editingExercise.rest || '')
			SetExerciseTargetWeight(editingExercise.targetWeight || '')
			SetExerciseCategory(editingExercise.category || 'core')
			SetExerciseTime(editingExercise.time || '')
		} else {
			SetExerciseName('')
			SetExerciseType('weights')
			SetExerciseSets('')
			SetExerciseReps('')
			SetExerciseRest('')
			SetExerciseTargetWeight('')
			SetExerciseCategory('core')
			SetExerciseTime('')
		}
	}, [editingExercise])

	function handleEdit(exercise) {
		SetEditingExercise(exercise)
		SetFormIsOpen(true)
	}

	return (
		<div className='App'>
			<Header>🏋️ MyWorkoutApp</Header>
			<DaySelector OnSetCurrentDay={SetCurrentDay}></DaySelector>
			<AddExercise
				formIsOpen={formIsOpen}
				onSetFormIsOpen={SetFormIsOpen}
				OnSetPlan={SetPlan}
				currentDay={currentDay}
				editingExercise={editingExercise}
				OnSetEditingExercise={SetEditingExercise}
				exerciseName={exerciseName}
				onSetExerciseName={SetExerciseName}
				exerciseType={exerciseType}
				onSetExerciseType={SetExerciseType}
				exerciseSets={exerciseSets}
				OnSetExerciseSets={SetExerciseSets}
				exerciseReps={exerciseReps}
				onSetExerciseReps={SetExerciseReps}
				exerciseRest={exerciseRest}
				OnSetExerciseRest={SetExerciseRest}
				exerciseTargetWeight={exerciseTargetWeight}
				onSetExererciseTargetWeight={SetExerciseTargetWeight}
				exerciseCategory={exerciseCategory}
				OnSetExerciseCategory={SetExerciseCategory}
				exerciseTime={exerciseTime}
				OnSetExerciseTime={SetExerciseTime}
			/>
			<ExerciseList plan={plan} currentDay={currentDay} onHandleEdit={handleEdit} />
			<WorkoutList plan={plan} currentDay={currentDay} />
			<WorkoutSummary />
		</div>
	)
}

function DaySelector({ OnSetCurrentDay }) {
	return (
		<div className='DaySelector'>
			{weekDays.map(day => (
				<Button value={day.short} fn={() => OnSetCurrentDay(day.name)} key={day.id}>
					{day.short}
				</Button>
			))}
		</div>
	)
}

function AddExercise({
	formIsOpen,
	onSetFormIsOpen,
	OnSetPlan,
	currentDay,
	editingExercise,
	OnSetEditingExercise,
	exerciseName,
	onSetExerciseName,
	exerciseType,
	onSetExerciseType,
	exerciseSets,
	OnSetExerciseSets,
	exerciseReps,
	onSetExerciseReps,
	exerciseRest,
	OnSetExerciseRest,
	exerciseTargetWeight,
	onSetExererciseTargetWeight,
	exerciseCategory,
	OnSetExerciseCategory,
	exerciseTime,
	OnSetExerciseTime,
}) {
	const [formError, SetFormError] = useState('')

	function addNewExercise(e) {
		e.preventDefault()

		if (!exerciseName || !exerciseSets || !exerciseRest) {
			SetFormError('Please fill in all required fields')
		}
		if (exerciseType === 'weights' && !exerciseTargetWeight && !exerciseReps) {
			SetFormError('For weighted exercises, reps and weight are required')
			return
		}
		if (exerciseType === 'time' && !exerciseTime) {
			SetFormError('Please specify the duration for time-based exercises')
			return
		}

		if (!editingExercise) {
			const newExercise = {
				id: crypto.randomUUID(),
				name: exerciseName,
				type: exerciseType,
				sets: exerciseSets,
				reps: exerciseType !== 'time' ? exerciseReps : null,
				time: exerciseType === 'time' ? exerciseTime : null,
				rest: exerciseRest,
				targetWeight: exerciseType === 'weights' ? exerciseTargetWeight : null,
				category: exerciseCategory,
			}

			OnSetPlan(plan =>
				plan.map(day => (day.day === currentDay ? { ...day, exercises: [...day.exercises, newExercise] } : day))
			)
		}

		if (editingExercise) {
			OnSetPlan(plan =>
				plan.map(day => {
					if (day.day !== currentDay) return day

					return {
						...day,
						exercises: day.exercises.map(exercise =>
							exercise.id === editingExercise.id
								? {
										...exercise,
										name: exerciseName,
										type: exerciseType,
										sets: exerciseSets,
										reps: exerciseType !== 'time' ? exerciseReps : null,
										time: exerciseType === 'time' ? exerciseTime : null,
										rest: exerciseRest,
										targetWeight: exerciseType === 'weights' ? exerciseTargetWeight : null,
										category: exerciseCategory,
								  }
								: exercise
						),
					}
				})
			)
			OnSetEditingExercise(null)
		}

		onSetFormIsOpen(!formIsOpen)
		onSetExerciseName('')
		onSetExerciseType('weights')
		OnSetExerciseSets('')
		onSetExerciseReps('')
		OnSetExerciseRest('')
		onSetExererciseTargetWeight('')
		OnSetExerciseCategory('core')
		OnSetExerciseTime('')
	}

	return (
		<>
			<div className='AddExercise'>
				<Button fn={() => onSetFormIsOpen(!formIsOpen)} styleEl={formIsOpen ? 'danger' : 'succes'}>
					{formIsOpen ? 'Close ❌' : 'Add New Exercise ➕'}
				</Button>
			</div>
			{formIsOpen && (
				<form onSubmit={addNewExercise}>
					<h2>Add New Exercise</h2>
					<div>
						<label>Name:</label>
						<input
							type='text'
							placeholder='Type exercise name ...'
							value={exerciseName}
							onChange={e => onSetExerciseName(e.target.value)}></input>
					</div>
					<div>
						<label>Type:</label>
						<select value={exerciseType} onChange={e => onSetExerciseType(e.target.value)}>
							<option value={'bodyweight'}>Bodyweight</option>
							<option value={'weights'}>With weight</option>
							<option value={'time'}>Time-based</option>
						</select>
					</div>
					<div>
						<label>Sets:</label>
						<input
							type='number'
							min={1}
							placeholder='Num sets ...'
							value={exerciseSets}
							onChange={e => OnSetExerciseSets(+e.target.value)}></input>
					</div>
					{exerciseType === 'time' && (
						<div>
							<label>Time:</label>
							<input
								type='number'
								min={1}
								placeholder='time in seconds ...'
								value={exerciseTime}
								onChange={e => OnSetExerciseTime(+e.target.value)}></input>
						</div>
					)}
					{exerciseType !== 'time' && (
						<div>
							<label>Reps:</label>
							<input
								type='number'
								min={1}
								placeholder='Num reps ...'
								value={exerciseReps}
								onChange={e => onSetExerciseReps(+e.target.value)}></input>
						</div>
					)}
					<div>
						<label>Rest:</label>
						<input
							type='number'
							min={1}
							placeholder='Break in seconds /s'
							value={exerciseRest}
							onChange={e => OnSetExerciseRest(+e.target.value)}></input>
					</div>
					{exerciseType !== 'time' && exerciseType !== 'bodyweight' && (
						<div>
							<label>Target Weight:</label>
							<input
								type='number'
								placeholder='Target Weight ...'
								value={exerciseTargetWeight}
								onChange={e => onSetExererciseTargetWeight(+e.target.value)}></input>
						</div>
					)}
					<div>
						<label>Exercise category:</label>
						<select value={exerciseCategory} onChange={e => OnSetExerciseCategory(e.target.value)}>
							{exerciseCategories.map(exercise => (
								<option value={exercise.value} key={exercise.id}>
									{exercise.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<Button
							fn={e => {
								e.preventDefault()
								onSetFormIsOpen(!formIsOpen)
							}}
							styleEl={'danger'}>
							Cancel ❌
						</Button>
						<Button styleEl={'success'}>{editingExercise ? 'EDIT 🛠️' : 'Save 💾'}</Button>
					</div>
					{formError && <p className='error-msg'>{formError}</p>}
				</form>
			)}
		</>
	)
}

function ExerciseList({ plan, currentDay, onHandleEdit }) {
	return (
		<div>
			<ul>
				{plan
					.filter(workout => workout.day === currentDay)
					.map(workout =>
						workout.exercises.map(exercise => (
							<ExerciseItem
								key={exercise.id}
								id={exercise.id}
								name={exercise.name}
								type={exercise.type}
								sets={exercise.sets}
								reps={exercise.reps}
								time={exercise.time}
								target={exercise.targetWeight}
								category={exercise.category}
								rest={exercise.rest}
								onHandleEdit={onHandleEdit}
							/>
						))
					)}
			</ul>
			<Button>Start Workout 🏃‍♂️‍➡️</Button>
		</div>
	)
}

function ExerciseItem({ id, name, type, sets, reps, time, target, category, rest, onHandleEdit }) {
	return (
		<li>
			<div>
				<h2>Name:</h2>
				<p>{name}</p>
			</div>
			<div>
				<h2>Type:</h2>
				<p>{type}</p>
			</div>
			<div>
				<h2>Sets:</h2>
				<p>{sets}</p>
			</div>
			{reps && (
				<div>
					<h2>Reps/Seconds:</h2>
					<p>{reps}</p>
				</div>
			)}
			{target && (
				<div>
					<h2>Target Weight:</h2>
					<p>{target} kg</p>
				</div>
			)}
			{time && (
				<div>
					<h2>Time:</h2>
					<p>{time}</p>
				</div>
			)}
			<div>
				<h2>Category:</h2>
				<p>{category} </p>
			</div>
			<div>
				<h2>Rest:</h2>
				<p>{rest} seconds </p>
			</div>
			<div>
				<Button
					fn={() =>
						onHandleEdit({
							id,
							name,
							type,
							sets,
							reps,
							time,
							targetWeight: target,
							category,
							rest,
						})
					}>
					Edit 🛠️
				</Button>
				<Button styleEl={'danger'}>Delete 🗑️</Button>
			</div>
		</li>
	)
}

function WorkoutList({ plan, currentDay }) {
	const activeWorkout = plan
		.filter(workout => workout.day === currentDay)
		.flatMap(workout => workout.exercises.map(exercises => exercises))

	return (
		<div>
			<ul>
				{activeWorkout.map(workout => (
					<WorkoutItem
						name={workout.name}
						sets={workout.sets}
						reps={workout.reps}
						target={workout.targetWeight}
						rest={workout.rest}
						key={workout.id}
					/>
				))}
			</ul>
			<BreakTimer />
		</div>
	)
}

function WorkoutItem({ name, sets, reps, target, rest }) {
	return (
		<li className='WorkoutItem'>
			<div className='WorkoutHeader'>
				{name}
				<Button>
					<ion-icon name='arrow-down-outline'></ion-icon>
				</Button>
			</div>
			<ul className='WorkoutDetails'>
				{Array.from({ length: sets }, (_, i) => (
					<li key={i}>
						Set {i + 1}: {reps} reps {target ? `${target} kg` : ''} ⏱️ {rest}
					</li>
				))}
			</ul>
		</li>
	)
}

function BreakTimer() {
	return <div className='BreakTimer'>04:44s</div>
}

function WorkoutSummary() {
	return (
		<div className='WorkoutSummary'>
			<p className='total'>Total Exercises: 3</p>
			<p className='completed'>Completed: 2</p>
			<p className='missed'>Missed: 1</p>
		</div>
	)
}
